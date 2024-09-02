import { useState } from 'react';

function useNumberFormatter() {
    const formatNumber = (number: any) => {
        if (number) {

            if (typeof number !== 'number') {
                number = parseFloat(number.toString().replace(',', '.'));
            }

            return number.toLocaleString('de-DE', {
                style: 'decimal',
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
            });
        } else {
            const value = 0;
            return value.toLocaleString('de-DE', {
                style: 'decimal',
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
            });
        }
    };

    return formatNumber;
}

export default useNumberFormatter;