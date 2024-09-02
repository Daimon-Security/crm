import { Table, Tbody, Td, Th, Thead, Tr } from "react-super-responsive-table"

export const ProductTable = ({ columns, rows }: any) => {
    const capitalize = (inputString: string): string => {
        if (!inputString || typeof (inputString) != "string") return inputString
        // Split the input string into words
        const words = inputString?.split(' ');
        //console.log("words: ", words);

        // Capitalize the first letter of each word and convert the rest to lowercase
        const capitalizedWords = words.map((word) => {
            if (word.length === 0) {
                return ''; // Handle empty words gracefully
            }
            const firstLetter = word[0].toUpperCase();
            const restOfWord = word.slice(1).toLowerCase();
            return firstLetter + restOfWord;
        });

        // Join the capitalized words back together
        const resultString = capitalizedWords.join(' ');

        return resultString;
    }

    return (
        <Table className="table table-bordered table-striped">
            <Thead className="table-light">
                <Tr>
                    <Th>Cód.</Th>
                    <Th>Nombre</Th>
                    <Th>Descripción</Th>
                    <Th>Categoría</Th>
                    <Th>Stock</Th>
                    <Th>Precio $</Th>
                    <Th>Precio $USD</Th>
                    <Th>Acción</Th>
                </Tr>
            </Thead>
            <Tbody>
                {rows.length == 0 ?
                    <Tr>
                        <Td>No hay registros.</Td>
                    </Tr> : (
                        rows.map((row: any, index: any) => (
                            <Tr key={index}>
                                <Td>{row.code}</Td>
                                <Td className="col-lg-3">{capitalize(row.name)}</Td>
                                <Td  className="col-lg-3">{capitalize(row.description)}</Td>
                                <Td>{capitalize(row.category)}</Td>
                                <Td>{row.stock}</Td>
                                <Td>{row.pricePesos}</Td>
                                <Td>{row.priceDollar}</Td>
                                <Td>{row.actions}</Td>
                            </Tr>
                        ))
                    )
                }
            </Tbody>
        </Table>
    )
}