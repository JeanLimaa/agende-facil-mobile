import { GenericForm } from "../components/GenericForm";
import { SettingsTabsLayout } from "../SettingsTabsLayout";
import { useRef } from "react";

export default function CompanyProfileScreen() {
  const companyFormRef = useRef(null);
  const addressFormRef = useRef(null);

  return (
    <SettingsTabsLayout
      headerTitle="Perfil da Empresa"
      tabs={[
        {
          key: "company",
          title: "Perfil",
          ref: companyFormRef,
          endpoint: "settings/companies/profile",
          method: "PUT",
          content: <GenericForm ref={companyFormRef} fields={[
            { name: "name", label: "Nome da Empresa", type: "text", placeholder: "Digite o nome da empresa" },
            { name: "email", label: "E-mail", type: "email", placeholder: "Digite o e-mail" },
            { name: "phone", label: "Telefone", type: "tel", placeholder: "Digite o telefone" },
            { name: "description", label: "Descrição da empresa", type: "text", placeholder: "Digite a descrição" },
            { name: "logo", label: "Logo da Empresa", type: "file" },
          ]} />,
        },
        {
          key: "address",
          title: "Endereço",
          ref: addressFormRef,
          endpoint: "/companies/address",
          method: "PUT",
          content: <GenericForm ref={addressFormRef} fields={[
            { name: "zipCode", label: "CEP", type: "text", placeholder: "Digite o CEP" },
            { name: "street", label: "Rua", type: "text", placeholder: "Digite a rua" },
            { name: "number", label: "Número", type: "text", placeholder: "Digite o número" },
            { name: "neighborhood", label: "Bairro", type: "text", placeholder: "Digite o bairro" },
            { name: "city", label: "Cidade", type: "text", placeholder: "Digite a cidade" },
            { name: "state", label: "Estado", type: "text", placeholder: "Digite o estado" },
          ]} />,
        }
      ]}
    />
  );
}