import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import { setFilter } from "../../../redux/plSlice";

export const usePLFilters = () => {
  const dispatch = useDispatch();
  const filters = useSelector((state: RootState) => state.pl.filters);
  const handleFilterChange = (key: keyof typeof filters, value: string) => {
    dispatch(setFilter({ key, value }));
  };

  return { filters, handleFilterChange };
};
