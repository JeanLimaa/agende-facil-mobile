import React from "react";
import { SettingsTabs } from "../SettingsTabsLayout";
import { GenericForm } from "../components/GenericForm";
import { useCompany } from "@/shared/hooks/queries/useCompany";
import { Loading } from "@/shared/components/Loading";
import ErrorScreen from "@/app/ErrorScreen";

export default function WorkingHoursScreen() {
  const {data, refetch, error, isLoading} = useCompany();

  if(isLoading) return <Loading />;
  if(error || !data?.schedule) {
    return <ErrorScreen onRetry={refetch} message="Ocorreu algum erro ao tentar obter os dados atuais." />;
  }
  
  return (
    <SettingsTabs 
      headerTitle="Horários de Funcionamento"
      endpoint= "/settings/company/working-hours"
      method= "PUT"
      tabs={[
        {
          key: "working-hours",
          title: "Horários de Funcionamento",
          content: 
            <GenericForm
              tabKey="working-hours"
              initialValues={{...data.schedule}}
              fields={[
                {
                  name: "",
                  type: "header",
                  label: "Defina os horários de funcionamento da empresa"
                },
                { 
                  name: "serviceInterval", 
                  label: "Intervalo de Serviço", 
                  type: "number",
                  placeholder: "Duração do serviço em minutos" 
                },
                {
                  type: "weekly-schedule",
                  name: "workingHours",
                  label: "Horários de Trabalho",
                  placeholder: "Defina os horários de trabalho para cada dia da semana"
                }
              ]}
            />
        },
      ]}
      />
  );
}