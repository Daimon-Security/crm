const BorderCard = ({ title, total, colorClass }: any) => (
    <div className="col my-3">
        <i className="fa-solid fa-house"></i>
        <div className={`border-card card radius-10 border-start border-0 border-3 border-${colorClass}`}>
            <div className="card-body">
                <div className="d-flex align-items-center">
                    <div>
                        <p className="mb-0 text-secondary title-corder">{title}</p>
                        <h6 className={`my-1 text-${colorClass}`}>{total}</h6>
                    </div>                    
                </div>
            </div>
        </div>
    </div>
);

export default BorderCard;
