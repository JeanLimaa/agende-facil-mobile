import { companyInfoQueryKey, useCompany } from "@/shared/hooks/queries/useCompany";
import { GenericForm } from "../components/GenericForm";
import { SettingsTabs } from "../SettingsTabsLayout";
import ErrorScreen from "@/app/ErrorScreen";
import { Loading } from "@/shared/components/Loading";
import { myQueryKey } from "@/shared/hooks/queries/useMe";

export default function CompanyProfileScreen() {
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
    <SettingsTabs
      headerTitle="Perfil da Empresa"
      endpoint="settings/company/profile"
      method="PUT"
      tabs={[
        {
          key: "profile",
          title: "Perfil",
          tanstackCacheKeys: [companyInfoQueryKey, myQueryKey],
          content: <GenericForm tabKey="profile" fields={[
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
          tanstackCacheKeys: [companyInfoQueryKey],
          content: <GenericForm tabKey="address" fields={[
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