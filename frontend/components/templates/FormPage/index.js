import dynamic from 'next/dynamic'
import {richTextToReact} from "../../../wagtail/utils/richtext";
import React, {useState} from "react";
import WagtailStreamData from "../../../wagtail/components/WagtailStreamData";
import {submitPageForm} from "../../../wagtail/forms/core";
import {variableNameConverter} from "../../../wagtail/api/base";


const FIELD_TYPE_MAP = new Map([
    ['dropdown', dynamic(() => import('../../molecules/FieldDropdown'))],
    ['email', dynamic(() => import('../../molecules/FieldEmail'))],
    ['multiline', dynamic(() => import('../../molecules/FieldMultiline'))],
    ['singleline', dynamic(() => import('../../molecules/FieldSingleline'))],
])


const MODULE_MAP = new Map([
  ['block_quote', dynamic(() => import('../../atoms/BlockQuoteBlock'))],
  ['heading_block', dynamic(() => import('../../atoms/HeadingBlock'))],
  ['image_block', dynamic(() => import('../../molecules/ImageBlock'))],
  ['paragraph_block', dynamic(() => import('../../atoms/ParagraphBlock'))],
])


function FormTemplate({
                        data: {
                          body = [],
                          formFields = [],
                          intro = '',
                          title = ''
                        },
                        formData = {},
                        onSubmit = () => {}
                      }) {
  return <>
    <div className="container">
      <div className="row">
        <div className="col-md-12">
          <h1 className="index-header__title">{title}</h1>
        </div>
        <div className="col-md-8 index-header__body-introduction">
          {intro && <p className="intro">{richTextToReact(intro)}</p>}
          {body && body.length && <WagtailStreamData blockMap={MODULE_MAP} streamData={body} />}
        </div>
      </div>
    </div>

    <div className="container">
      <div className="row">
        <div className="col-md-8 form-page">
          <form onSubmit={onSubmit} method="POST">
            {formData.subject &&
              <ol>
                {formData.subject.map((error, idx) => <li key={idx}>
                  <strong>Subject: {error}</strong>
                </li>)}
              </ol>
            }

            {formFields.map((field, idx) => {
              const {
                fieldType,
                helpText = '',
                label = '',
                required,
                name,
                ...rest
              } = field
              const convertedName = variableNameConverter(name)
              return <div className="form-page__field" aria-required={field.required} key={idx}>
                {label}{required && <span className="required">*</span>}
                {helpText && <p className="help">{helpText}</p>}
                {FIELD_TYPE_MAP.has(fieldType) && React.createElement(
                    FIELD_TYPE_MAP.get(fieldType),
                    {name, required, ...rest}
                )}
                {formData[convertedName] && <div className="errors">
                  <ul>
                    {formData[convertedName].map((error, idx) => <li key={idx}>{error}</li>)}
                  </ul>
                </div>}
              </div>
            })}

            <input type="submit" />
          </form>
        </div>
      </div>
    </div>
  </>
}


function LandingTemplate({data: {title, thankYouText}}) {
  return <div className="container form-page-thanks">
    <div className="row">
      <div className="col-md-12">
        <h1 className="index-header__title">{title}</h1>
      </div>
      <div className="col-md-7 index-header__body-introduction">
        {richTextToReact(thankYouText)}
      </div>
    </div>
  </div>
}


export default function FormPage({
                                   data: {id},
                                   data
                                 }) {
  const [formData, setFormData] = useState({})

  const onSubmit = (event) => {
    submitPageForm(id, event.target).then(formData => {
      setFormData(formData)
    })
    event.preventDefault()
    return false;
  }

  return formData.success
      && <LandingTemplate data={formData.data} />
      || <FormTemplate data={data} formData={formData.data} onSubmit={onSubmit}/>
}
