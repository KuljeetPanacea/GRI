import { Model, Document } from "mongoose";

// Helper function to get all fields referencing other collections
export function getReferencedFields(model: Model<any>): string[] {
  const referenceFields: string[] = [];

  for (const key in model.schema.paths) {
    const path = model.schema.paths[key];

    // Check if 'options' exists and is of type 'ref'
    if ((path as any).options && (path as any).options.ref) {
      referenceFields.push(key);
    }
  }

  return referenceFields;
}

// Helper function to get all models referencing this model
export async function getModelsReferencingThis(
  model: Model<any>,
): Promise<string[]> {
  const referencingModels: string[] = [];

  for (const modelName of Object.keys(model.db.models)) {
    const schema = model.db.models[modelName].schema;

    for (const path in schema.paths) {
      const schemaPath = schema.paths[path];

      // Check if this schema path references the current model's name
      if (
        (schemaPath as any).options &&
        (schemaPath as any).options.ref === model.modelName
      ) {
        referencingModels.push(modelName);
        break;
      }
    }
  }

  return referencingModels;
}

//Generic decorator for referential integrity checks
export function CheckReferentialIntegrity(
  action: "create" | "update" | "delete",
) {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor,
  ) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      const document: Document = args[0]; // Document to be created, updated, or deleted
      //const session = args[args.length - 1]; // Assume the last argument is the session

      const model: Model<any> = this.model;

      if (action === "delete") {
        const referencingModels = await getModelsReferencingThis(model);

        await Promise.all(
          referencingModels.map(async (name) => {
            const refModel = model.db.model(name);
            const refPath = (refModel.schema.path("_id") as any)?.options?.ref; // Safe type assertion

            if (
              refPath &&
              (await refModel.exists({ [refPath]: document._id }))
            ) {
              throw new Error(
                `Cannot delete; document is referenced by ${name}.`,
              );
            }
          }),
        );
      }

      if (action === "create" || action === "update") {
        const referencedFields = getReferencedFields(model);
        for (const field of referencedFields) {
          // Cast the path to access options
          const schemaPath = model.schema.path(field);
          const referencedModelName = (schemaPath as any).options.ref; // Type casting
          const referencedModel = model.db.model(referencedModelName);
          const referenceExists = await referencedModel
            .findById(document[field])
            .exec();

          if (!referenceExists) {
            throw new Error(
              `Cannot ${action} document; referenced ${referencedModelName} does not exist.`,
            );
          }
        }
      }

      return await originalMethod.apply(this, args);
    };

    return descriptor;
  };
}
