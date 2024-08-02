import { useMemo, useState } from "react"
import { Input, Switch, InputNumber, message } from "antd"
import { hasDecimalPoint, isNumberType } from "@/common"
import { PropertyType, InputType } from "@/types"

import styles from "./index.module.scss"

type Status = 'error' | 'warning' | ""


interface PropertyItemProps {
  name: string
  propertyType?: PropertyType
  value?: any,
  className?: string
  onUpdate?: (value: any) => void
}


interface CustomInputProps {
  name: string
  propertyType: PropertyType
  value?: any,
  onUpdate?: (value: any) => void
}

const checkValue = (value: any, propertyType: PropertyType, inputType: InputType): boolean => {
  if (propertyType == "Uint32") {
    if (value < 0) {
      message.error(`${value} should be greater than 0`)
      return false
    }
  }

  if (inputType == "number") {
    if (propertyType != "float32" && propertyType != "float64")
      if (hasDecimalPoint(value)) {
        message.error(`${value} should be an integer`)
        return false
      }
  }

  return true
}



const CustomInput = (CustomInputProps: CustomInputProps) => {
  const { propertyType, value: propsValue, onUpdate } = CustomInputProps
  const [value, setValue] = useState(propsValue)
  const [status, setStatus] = useState<Status>("")

  const inputType: InputType = useMemo(() => {
    if (propertyType === "string") {
      return "string"
    } else if (isNumberType(propertyType)) {
      return "number"
    } else if (propertyType === "bool") {
      return "boolean"
    }

    return "string"
  }, [propertyType])

  const onChange = (v: any) => {
    let value
    if (typeof v === "object") {
      if (v.target.value) {
        value = v.target.value
      }
    } else {
      value = v
    }
    if (checkValue(value, propertyType, inputType)) {
      setValue(value)
      setStatus("")
      if (inputType === "boolean") {
        onUpdate?.(value)
      }
    } else {
      setStatus("error")
    }
  }

  const onBlur = () => {
    setTimeout(() => {
      setStatus("")
    }, 0)
    if (value !== propsValue) {
      onUpdate?.(value)
    }
  }


  if (inputType === "string") {
    return <Input
      size="small"
      value={value}
      allowClear
      status={status}
      onChange={onChange}
      onBlur={onBlur}
    ></Input>
  } else if (inputType === "number") {
    return <InputNumber
      size="small"
      value={value}
      type='number'
      status={status}
      onChange={onChange}
      onBlur={onBlur}
      style={{ width: "100%" }}
    ></InputNumber>
  } else if (inputType === "boolean") {
    return <Switch
      size="small"
      value={value}
      onChange={onChange}></Switch>
  }

}



const PropertyItem = (props: PropertyItemProps) => {
  const { name, propertyType, value, className, onUpdate } = props

  return propertyType ? <div className={`${styles.item} ${className}`}>
    <div className={styles.text}>{name}:</div>
    <CustomInput name={name} propertyType={propertyType} value={value} onUpdate={onUpdate}></CustomInput>
  </div> : null
}



export default PropertyItem