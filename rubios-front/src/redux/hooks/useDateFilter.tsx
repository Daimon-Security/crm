import { useState } from "react";

interface DateFilter {
    startDate: Date;
    endDate: Date;
}

interface UseDateFilterProps {
    initialStartDate?: Date;
    initialEndDate?: Date;
}

interface UseDateFilterReturn {
    dateFilter: DateFilter;
    setStartDate: (date: Date) => void;
    setEndDate: (date: Date) => void;
}

export const useDateFilter = ({
    initialStartDate = new Date(),
    initialEndDate = new Date(),
}: UseDateFilterProps): UseDateFilterReturn => {
    const [startDate, setStartDate] = useState(initialStartDate);
    const [endDate, setEndDate] = useState(initialEndDate);

    const dateFilter: DateFilter = {
        startDate,
        endDate,
    };

    return { dateFilter, setStartDate, setEndDate };
};
