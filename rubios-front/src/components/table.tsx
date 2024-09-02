import React from 'react';
import { MDBDataTable } from 'mdbreact';


const DatatablePage = ({ data }: any) => {


    return (
        <>

            <MDBDataTable
                small={true}
                //scrollY={true}
                striped
                bordered
                data={data}
                responsive={true}
                hover={true}
                noBottomColumns={true}
                noRecordsFoundLabel={'no hay registros.'}
                paginationLabel={['anterior', 'siguiente']}
                searching={false}
                searchLabel={'buscar'}
                displayEntries={false}
                //info={false}
                pagesAmount={7}
                paging={true}
                onPageChange={(value) => {
                }}
                onSearch={(value) => {
                }}
                entries={7}
                //entriesOptions={[1, 2 ,3]}
                infoLabel={['mostrando', 'a', 'de', 'registros']}
            />
        </>
    );
}

export default DatatablePage;