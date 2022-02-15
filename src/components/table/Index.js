
import React from 'react'
import ReactDataTable from 'react-data-table-component'
import SearchComponent from '../search/Index'

export const DataTable = (props) => {
    return (
        <ReactDataTable
            fixedHeader={props.fixedHeader}
            fixedHeaderScrollHeight={props.fixedHeaderScrollHeight}
            customStyles={props.customStyles}
            columns={props.columns}
            data={props.data}
            progressPending={props.loading}
            pagination={props.pagination}
            paginationServer
            paginationTotalRows={props.totalRows}
            onChangeRowsPerPage={props.handlePerRowsChange}
            paginationRowsPerPageOptions={[10, 15, 20, 25, 30, 50, 100, 500, 1000, 5000, 50000, 100000, 1000000, 10000000]}
            onChangePage={props.handlePageChange}
            subHeader={props.searchable}
            subHeaderComponent={
                <SearchComponent
                    placeholder={props.placeholder}
                    searchLoading={props.searchLoading}
                    search={query => props.search(query)}
                    suggestion={props.suggestion}
                    clear={() => props.clearSearch()}
                />}
        />
    );
};
