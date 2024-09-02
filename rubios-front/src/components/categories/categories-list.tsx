import { Col, Row } from "react-bootstrap";
import CommonList from "../common/list";
import { useAppDispatch, useAppSelector } from "../../redux/hooks/hooks";
import { RootState } from "../../redux/store/store";
import { useEffect, useState } from "react";
import { Category } from "../../entities/category";
import { deleteCategory, getAll, getByCategoryByName, setCategorySelected } from "../../redux/slices/category-slice";
import { ButtonsActions } from "../common/buttons-actions";
import Loading from "../common/loading";

export const CategoriesList = () => {
    const dispatch = useAppDispatch();
    const { categorySelected, categories } = useAppSelector((state: RootState) => state.categories);
    const { userRole } = useAppSelector((state: RootState) => state.users);
    const [showCustomMessage, setShowCustomMessage] = useState(false);
    const [categoriesLoaded, setCategoriesLoaded] = useState(false);



    const handleOpenCustomMessageModal = (category: Category) => {
        dispatch(setCategorySelected(category));
        setShowCustomMessage(true);
    };

    const handleCloseCustomMessageModal = () => {
        setShowCustomMessage(false);
    };

    const goToEdit = (category: any) => {
        dispatch(setCategorySelected(category));
    };

    const remove = async () => {
        if (categorySelected) {
             await dispatch(deleteCategory(categorySelected.id));

            handleCloseCustomMessageModal();
        }

    };

    const goToDetail = () => { }

    const searchByName = (name: any) => {
        dispatch(getByCategoryByName(name));
    };

    const rows = categories.map((category: Category, index: number) => ({
        id: index + 1,
        name: category.name,
        actions: (
            <ButtonsActions entity={category} openModal={handleOpenCustomMessageModal} goToEdit={goToEdit}
                goToDetail={goToDetail} userRole={userRole} routeEdit={`/category/${category.id}/edit`} />
        ),
    }));
    const data = {
        columns: [
            {
                label: '#',
                field: 'id',
                sort: 'asc',
                width: 100
            },
            {
                label: 'Categoría',
                field: 'name',
                sort: 'asc',
                width: 700
            },
            {
                label: 'Acciones',
                field: 'actions',
                sort: 'asc',
                width: 100
            }
        ],
        rows: rows
    };

    function getOptionsCategories() {
        return categories.map((option: any) => {
            return { id: option.id, label: option.name }
        })
    }

    async function getCategories(){
        await dispatch(getAll());
        setCategoriesLoaded(true);
    }

    useEffect(() => {
        getCategories();
    }, [])

    if (!categoriesLoaded) {
        return <Loading/> // Puedes mostrar un indicador de carga
    }

    return (
        <CommonList
            title={'Categorías'}
            data={data}
            routeCreate={'/category-create'}
            searchByName={searchByName}
            handleCloseCustomMessageModal={handleCloseCustomMessageModal}
            showCustomMessage={showCustomMessage}
            remove={remove}
            userRole={userRole}
            getOptions={getOptionsCategories}
        />
        
    )
};

export default CategoriesList;