import { Button, Col, Row } from "react-bootstrap"
import { MdArrowBack, MdArrowForward } from "react-icons/md"
import { getDayString } from "../function-common/get-day-string";
import { addDays, format, subDays } from "date-fns";
import { useAppDispatch, useAppSelector } from "../../redux/hooks/hooks";
import { getDay, setDateQuery } from "../../redux/slices/credit-slice";
import { firstChartToUpperCase } from "../function-common/get-firstChart-toUpperCase";
import { RootState } from "../../redux/store/store";
import { useEffect, useState } from "react";
import { getDateString } from "../function-common/get-date-string";

interface HeaderListDateProps {
    title: string;
    startDate: string;
    endDate: string | null;
    applyFilter: boolean;
    onDateChange: (newDate: Date) => void;
}

export const HeaderListDate = ({ title, startDate, endDate, applyFilter, onDateChange }: HeaderListDateProps) => {
    const dispatch = useAppDispatch();
    const { dateQuery } = useAppSelector((state: RootState) => state.credits);
    const [currentDate, setCurrentDate] = useState<Date | null>((dateQuery)?new Date(dateQuery.date): new Date());



    async function handlePreviousDay() {
        if (currentDate) {
          const newDate = subDays(currentDate, 1);
          setCurrentDate(newDate); 
          onDateChange(newDate); 
        }
      }
    
      async function handleNextDay() {
        if (currentDate) {
          const newDate = addDays(currentDate, 1);
          setCurrentDate(newDate); 
          onDateChange(newDate);
        }
      }


    useEffect(() => {
        dispatch(getDay());
    }, [])

    return (
        <>
            <Row className="border-top border-bottom p-2 mb-4 align-items-center d-flex justify-content-evenly">
                <Col xs={1}>
                    {!applyFilter ?
                        <Button className="bg-transparent border-0" onClick={handlePreviousDay}>
                            <MdArrowBack size={30} color="grey" />
                        </Button>
                        : ('')
                    }
                </Col>
                <Col lg={10} xs={8} className="d-flex justify-content-center text-center row">
                    {
                        startDate === endDate ? <>
                            <Col lg={10} xs={12}>
                                <h3>{title} {(dateQuery) ? firstChartToUpperCase(getDayString(currentDate)) : null}<span className="d-none d-lg-block"> {getDateString(currentDate)}</span> </h3>
                            </Col>
                            <Col lg={3} xs={12} className="d-lg-none">
                                <h3>{getDateString(currentDate)} </h3>
                            </Col>
                        </> : (
                            <>
                                <Col lg={10} xs={12}>
                                    <h3>{title} {(dateQuery) ? firstChartToUpperCase(getDayString(currentDate)) : null}<span className="d-none d-lg-block"> {startDate} - {endDate}</span> </h3>
                                </Col>
                                <Col lg={3} xs={12} className="d-lg-none">
                                    <h3>{startDate} </h3>
                                </Col>
                                <Col lg={3} xs={12} className="d-lg-none">
                                    <h3>{endDate} </h3>
                                </Col>
                            </>
                        )
                    }

                </Col>
                <Col xs={1} className="d-flex justify-content-end">
                    {!applyFilter ?
                        <Button className="bg-transparent border-0" onClick={handleNextDay}>
                            <MdArrowForward size={30} color="grey" />
                        </Button> : ('')
                    }
                </Col>
            </Row>
        </>
    )
};
export default HeaderListDate;