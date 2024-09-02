
export interface CustomMessageProps {
    title: string,
    message: string,
    acceptBtnName: string,
    cancelBtnName: string,
    onCloseModal: ()=>void,
    operation: ()=>void,
    typeOperation: string,
}