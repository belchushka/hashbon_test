import {SelectProps} from "@mantine/core";

type DefaultProps = Omit<SelectProps, "data">
export interface ICurrencySelect extends DefaultProps {
  exclude?: string | null
}
