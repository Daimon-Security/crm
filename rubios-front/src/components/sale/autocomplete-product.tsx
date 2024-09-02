import React, { useState } from 'react';
import { Typeahead } from 'react-bootstrap-typeahead';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-bootstrap-typeahead/css/Typeahead.css';

// interface Option {
//   id: number;
//   label: string;
// }


interface AutocompleteProductProps {
  placeholder: string
  options: any[];
  field: any;
  form: any;
  disabled: boolean,
  onSelect: (event: any) => void,
  unSelect: (event: any) => void,
}

export const AutocompleteProduct = ({ placeholder, options, onSelect, field, form, disabled, unSelect }: AutocompleteProductProps) => {
  const handleSelect = (selected: any[]) => {
    if (selected.length > 0) {
      const selectedOption = selected[0] || null;
      form.setFieldValue(field.name, selectedOption?.id || null);
      //console.log("seleccionado: ", selected);
      onSelect(selectedOption?.id)
    } else {
       console.log("seleccionado: ", selected);
      unSelect(selected);
    }
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

export default AutocompleteProduct;
