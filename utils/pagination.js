exports.buildPaginationResponse = ({ totalDocs,nextCursor, hasNextPage, page, limit }) => {
  return {
    totalItems: totalDocs,
    hasNextPage,
    currentPage: page,
    pageSize: limit,
    nextCursor
  };
};
