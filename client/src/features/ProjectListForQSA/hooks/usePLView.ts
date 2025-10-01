import { useState, useMemo } from "react";
import { useSelector } from "react-redux";
import { selectFilteredProjects } from "../../../redux/plSlice";

export const usePLView = (pageSize: number) => {

  const filteredProjects = useSelector(selectFilteredProjects);
  const memoizedFilteredProjects = useMemo(() => filteredProjects || [], [filteredProjects]);
  const [currentPage, setCurrentPage] = useState(1);
  const totalItems = memoizedFilteredProjects.length;
  const totalPages = Math.ceil(totalItems / pageSize);
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return memoizedFilteredProjects.slice(startIndex, startIndex + pageSize);
  }, [memoizedFilteredProjects, currentPage, pageSize]);

  return { paginatedData, currentPage, totalPages, totalItems, setCurrentPage };
};
