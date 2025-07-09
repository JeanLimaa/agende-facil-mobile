import { useCompany } from "@/shared/hooks/queries/useCompany";
import { GenericForm } from "../components/GenericForm";
import { SettingsTabsLayout } from "../SettingsTabsLayout";
import { useRef } from "react";
import ErrorScreen from "@/app/ErrorScreen";
import { Loading } from "@/shared/components/Loading";

export default function CompanyProfileScreen() {
  const companyFormRef = useRef(null);
  const addressFormRef = useRef(null);

  const {
    data: companyInfo,
    isLoading: isLoadingCompanyInfo,
    error: companyError,
    refetch
  } = useCompany();

  if (isLoadingCompanyInfo) {
    return <Loading />;
  }

  if (companyError) {
    return <ErrorScreen message="Ocorreu algum erro ao tentar obter os dados atuais" onRetry={refetch} />;
  }

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
            { name: "name", label: "Nome da Empresa", type: "text" },
            { name: "email", label: "E-mail", type: "email" },
            { name: "phone", label: "Telefone", type: "tel" },
            { name: "description", label: "Descrição da empresa", type: "text" },
            { name: "logo", label: "Logo da Empresa", type: "file" },
          ]} initialValues={{
            ...companyInfo?.profile
          }} />,
        },
        {
          key: "address",
          title: "Endereço",
          ref: addressFormRef,
          endpoint: "settings/companies/address",
          method: "PUT",
          content: <GenericForm ref={addressFormRef} fields={[
            { name: "country", label: "País", type: "text"},
            { name: "city", label: "Cidade", type: "text" },
            { name: "state", label: "Estado", type: "text" },
            { name: "zipCode", label: "CEP", type: "text" },
            { name: "street", label: "Rua", type: "text" },
            { name: "number", label: "Número", type: "text"},
            { name: "neighborhood", label: "Bairro", type: "text" },
          ]} initialValues={{...companyInfo?.address}}
          />,
        }
      ]}
    />
  );
}