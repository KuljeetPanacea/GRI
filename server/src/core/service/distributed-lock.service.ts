import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';
import { hostname } from 'os';
import { LoggerService } from '../logger/services/logger.service';


@Injectable()
export class DistributedLockService {
  constructor(
    @InjectConnection() private readonly connection: Connection,
    private readonly logger: LoggerService
  ) {
    // Ensure locks collection exists with TTL index
    this.initLocksCollection();
  }
  
  private async initLocksCollection() {
    try {
      // Create TTL index if it doesn't exist
      await this.connection.db.collection('distributed_locks').createIndex(
        { expiresAt: 1 },
        { 
          expireAfterSeconds: 0,
          background: true,
          name: 'locks_ttl_idx'
        }
      );
    } catch (error) {
      this.logger.error('Failed to initialize locks collection', error);
    }
  }

  async acquire(lockName: string, ttlMs = 30000): Promise<boolean> {
    try {
      // Try to insert a lock document with expiration
      const lockDocument = {
        _id: lockName,
        acquiredAt: new Date(),
        expiresAt: new Date(Date.now() + ttlMs),
        instance: hostname() + ':' + process.pid 
      };

      await this.connection.db.collection('distributed_locks').insertOne(
        lockDocument as any,
        { writeConcern: { w: 'majority' } }
      );
      
      return true;
    } catch (error) {
      // Duplicate key error means someone else has the lock
      if (error.code === 11000) {
        // Check if lock is stale and try to take it
        const result = await this.connection.db.collection('distributed_locks').findOneAndUpdate(
          { 
            _id: lockName, 
            expiresAt: { $lt: new Date() } 
          } as any,
          { 
            $set: { 
              acquiredAt: new Date(), 
              expiresAt: new Date(Date.now() + ttlMs),
              instance: hostname() + ':' + process.pid
            } 
          }
        );
        
        return !!result?.value;
      }
      
      this.logger.error(`Error acquiring lock ${lockName}`, error);
      return false;
    }
  }

  async release(lockName: string): Promise<void> {
    try {
      await this.connection.db.collection('distributed_locks').deleteOne({ 
        _id: lockName, 
        instance: hostname() + ':' + process.pid 
      } as any);
    } catch (error) {
      this.logger.error(`Error releasing lock ${lockName}`, error);
    }
  }
}