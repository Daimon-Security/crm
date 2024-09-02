import { MdAddCircleOutline, MdEdit, MdFilterAlt, MdSearch } from "react-icons/md";
import { Link } from "react-router-dom";
import CustomMessage from "../common/custom-message/custom-message";
import DatatablePage from "../table";
import { ButtonsActions } from "../common/buttons-actions";
import { useAppDispatch, useAppSelector } from "../../redux/hooks/hooks";
import { useEffect, useState } from "react";
import { RootState } from "../../redux/store/store";
import { deleteProduct, getAll, getByCategory, getByProductName, setProductSelected } from "../../redux/slices/product-slice";
import { getAll as getCategories } from "../../redux/slices/category-slice"
import { ProductListDto } from "../../entities/dto/product-list";
import ProductFilterModal from "./filter-modal-product";
import { Col, Row } from "react-bootstrap";
import Loading from "../common/loading";
import TableResponsive from "../common/table-responsive";
import { ProductTable } from "./table-products";
import { SearchByName } from "../common/search-by-name";
import useNumberFormatter from "../../redux/hooks/useNumberFormatter";

export const ProductList = () => {
    const dispatch = useAppDispatch();
    const formatNumber = useNumberFormatter();
    const { products, productSelected } = useAppSelector((state: RootState) => state.products);
    const { userRole } = useAppSelector((state: RootState) => state.users);
    const { categories } = useAppSelector((state: RootState) => state.categories);
    const [showFilterModal, setShowFilterModal] = useState(false);
    const [nameSearch, setNameSearch] = useState<string>('');
    const [showCustomMessage, setShowCustomMessage] = useState(false);
    const [categoriesOptions, setOptions] = useState<any>([]);
    const [apply, setApply] = useState<boolean>(false);
    const [productLoaded, setProductLoaded] = useState(false);

    const handleOpenCustomMessageModal = (product: ProductListDto) => {
        dispatch(setProductSelected(product));
        setShowCustomMessage(true);
    };

    const handleCloseCustomMessageModal = () => {
        setShowCustomMessage(false);
    };

    const handleShowFilterModal = () => {
        setShowFilterModal(true);
    };

    const handleCloseFilterModal = () => {
        setShowFilterModal(false);
    };

    const handleApplyFilter = (category: string | null) => {
        setApply(true);
        if (category) dispatch(getByCategory(parseInt(category)));
    }

    const offApplyFilter = () => {
        dispatch(getAll());
    }

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setNameSearch(event.target.value);
    };


    const remove = () => {
        if (productSelected) {
            console.log("estoy eliminando registro: ", productSelected.id);
            dispatch(deleteProduct(productSelected.id));
        }
        handleCloseCustomMessageModal();

    };


    const goToEdit = (product: ProductListDto) => {
        //console.log("producto seleccionado: ", product);
        dispatch(setProductSelected(product));
    };

    const goToDetail = (product: ProductListDto) => {
        dispatch(setProductSelected(product));
    }

    const getCategoriesOptions = () => {
        const categoriesOptions = categories.map(x => {
            return { value: x.id, name: x.name }
        });
        setOptions(categoriesOptions)
    }

    const rows = products.map((product: ProductListDto, index) => ({
        code: product.code,
        name: product.name,
        description: product.description,
        category: product.category,
        stock: (
            <Row>
                <Col>
                    <span>{product.stock}</span>
                </Col>
                <Col>
                    <Link to={`/product/${product.id}/edit-inventory`}>
                        <button className="btn btn-primary me-1 mb-1"><MdAddCircleOutline /></button>
                    </Link>
                </Col>
            </Row>
        ),
        pricePesos: formatNumber(product.pricePesos),
        priceDollar: formatNumber(product.priceDollar),
        actions: (
            <ButtonsActions entity={product} openModal={handleOpenCustomMessageModal}
                goToEdit={goToEdit} goToDetail={goToDetail} userRole={userRole} routeEdit={`/product/${product.id}/edit`} routeDetail={`/product/${product.id}/detail`} />

        ),
    }));

    const data = {
        columns: [
            {
                label: 'Código',
                field: 'code',
                sort: 'asc',
                ////width: 50
            },
            {
                label: 'Nombre',
                field: 'name',
                sort: 'asc',
                ////width: 80
            },
            {
                label: 'Descripción',
                field: 'description',
                sort: 'asc',
                //width: 100
            },
            {
                label: 'Categoría',
                field: 'category',
                sort: 'asc',
                //width: 100
            },
            {
                label: 'Stock',
                field: 'stock',
                sort: 'asc',
                //width: 100
            },
            {
                label: 'Precio $',
                field: 'pricePesos',
                sort: 'asc',
                //width: 100
            },
            {
                label: 'Precio $USD',
                field: 'priceDollar',
                sort: 'asc',
                //width: 100
            },
            {
                label: 'Acciones',
                field: 'actions',
                sort: 'asc',
                //width: 100
            }
        ],
        // rows: [...credits],
        rows: rows
    };

    function getOptionsProducts() {
        return products.map((option: any) => {
            return { id: option.id, label: option.name }
        })
    }

    function searchByProductName(product: number){
        dispatch(getByProductName(product));
    }

    async function getProducts() {
        await dispatch(getAll());
        setProductLoaded(true);
    }

    useEffect(() => {
        getProducts();
        dispatch(getCategories());
    }, [])

    useEffect(() => {
        getCategoriesOptions()
    }, [categories])

    if (!productLoaded) {
        return <Loading /> // Puedes mostrar un indicador de carga
    }

    return (
        <div className="p-3">
            <div className="border-top border-bottom py-2 mb-4 d-flex align-items-center justify-content-between">
                <h3>Productos</h3>
                <Link to="/product-create">
                    <button className="btn btn-primary">Nuevo <MdAddCircleOutline /></button>
                </Link>
            </div>
            <div className="d-flex align-items-center mb-3 row">
                <SearchByName options={getOptionsProducts()} placeholder='escribe el nombre...' getByOption={searchByProductName} />
            </div>
            <button className="btn btn-primary mb-3" onClick={handleShowFilterModal}><MdFilterAlt /></button>
            {apply ?
                <button className="mb-3 ms-2 btn btn-outline-danger" onClick={() => {
                    setApply(false);
                    dispatch(getAll())
                }}>
                    Quitar filtros
                </button> : ('')
            }
            <ProductFilterModal
                show={showFilterModal}
                onClose={handleCloseFilterModal}
                onApplyFilter={handleApplyFilter}
                offApplyFilter={offApplyFilter}
                options={categoriesOptions}
                apply={apply}
            />

            <CustomMessage
                title={'Eliminar registro'}
                message={'¿Seguro que quiere eliminar el registro?'}
                acceptBtnName={'Eliminar'}
                cancelBtnName={'Cancelar'}
                onCloseModal={handleCloseCustomMessageModal}
                operation={remove}
                showModal={showCustomMessage}
                typeOperation="remove"
            />

            <ProductTable columns={data.columns} rows={data.rows}/>

        </div>
    )
};
 export default ProductList;