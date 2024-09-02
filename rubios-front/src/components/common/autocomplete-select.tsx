import React, { useState } from 'react';
import { Typeahead } from 'react-bootstrap-typeahead';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-bootstrap-typeahead/css/Typeahead.css';

// interface Option {
//   id: number;
//   label: string;
// }


interface AutocompleteSelectProps {
  placeholder: string
  options: any[];
  field: any;
  form: any;
  disabled: boolean,
  onSelect: (event: any) => void,
}

export const AutocompleteSelect = ({ placeholder, options, onSelect, field, form, disabled }: AutocompleteSelectProps) => {
  const handleSelect = (selected: any[]) => {
    const selectedOption = selected[0] || null;
    form.setFieldValue(field.name, selectedOption?.id || null);
    //console.log("seleccionado: ", selected);
    onSelect(selectedOption?.id)
  };
  return (
    <div>
      <Typeahead
        {...field}
        id="autocomplete-select"
        labelKey="label"
        clearButton={true}
        emptyLabel="No se encontraron resultados"
        options={options}
        selected={options.filter(option => option.id === field.value)}
        onChange={handleSelect}
        placeholder={placeholder}
        disabled={disabled}
      />
    </div>
  );
};

export default AutocompleteSelect;
