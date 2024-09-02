import { Field, Form, Formik } from "formik";
import AutocompleteSelect from "./autocomplete-select";
import { useState } from "react";

interface SearchByName {
    options: any;
    placeholder: string
    getByOption: (id:number)=>void
}

export const SearchByName = ({ options, placeholder, getByOption }: SearchByName) => {

    return (
        <Formik
            initialValues={{ name: '' }}
            onSubmit={(values: any) => {
            }}
        >
            {({ handleSubmit,
                isSubmitting }) => (
                <Form onSubmit={handleSubmit} className=''>
                        <Field className='form-control row col-12' name="name" id="name" component={AutocompleteSelect} placeholder={placeholder} options={options}
                            onSelect={(e: any) => {
                               // console.log("cliente seleccionado: ", e);
                                getByOption(e);
                             }}    
                                                     
                        />
                </Form>
            )}
        </Formik>
    )
}