import { MdDelete, MdEdit, MdArticle } from 'react-icons/md';
import { Link } from 'react-router-dom';
import { useLocation } from 'react-router-dom';

interface ButtonActionProps {
  entity: any;
  openModal: (entity: any) => void;
  goToEdit: (entity: any) => void;
  goToDetail: (entity: any) => void;
  userRole: string | null;
  routeEdit: string;
  routeDetail?: string

}

export const ButtonsActions = ({ entity, openModal, goToEdit, goToDetail, userRole, routeEdit, routeDetail }: ButtonActionProps) => {
  const location = useLocation();
  const route = location.pathname;
  const showButtonDetail = location.pathname != '/users' && location.pathname != '/clients' && location.pathname != '/categories'; // Determina si el botón debe mostrarse

  return (
    <>
      {userRole == 'admin' ? (
        <>
          <Link to={routeEdit}>
            <button className="btn btn-primary me-1 mb-1" onClick={() => { goToEdit(entity) }} title="Modificar"><MdEdit /></button>
          </Link>
          {route != '/sale-credits'?
            <button className="btn btn-danger me-1 mb-1" onClick={() => openModal(entity)} title="Eliminar"><MdDelete /></button>:('')
          }
        </>) : ('')
      }
      {(showButtonDetail && routeDetail) ?
        <Link to={routeDetail}>
          <button className="btn btn-success me-1 mb-1" onClick={() => { goToDetail(entity) }} title="Detalle"><MdArticle /></button>
        </Link> : ('')
      }
    </>
  )
}