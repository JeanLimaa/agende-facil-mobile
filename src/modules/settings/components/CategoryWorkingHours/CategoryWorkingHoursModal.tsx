import React from "react";
import { WorkingHoursModal } from "@/shared/components/WorkingHoursModal/WorkingHoursModal";
import { Category, CategoryWorkingHour } from "@/shared/types/category.interface";
import { DailyWorkingHour } from "@/shared/types/working-hours.interface";
import { Employee } from "@/shared/types/employee.interface";
import { CompanyWorkingHours } from "@/shared/types/company.types";

interface CategoryWorkingHoursModalProps {
  visible: boolean;
  onClose: () => void;
  category: Category;
  initialHours: CategoryWorkingHour[];
  onSave: (hours: DailyWorkingHour[]) => void;
  loading: boolean;
  employee?: Employee;
  companyWorkingHours?: CompanyWorkingHours;
}

export function CategoryWorkingHoursModal({
  visible,
  onClose,
  category,
  initialHours,
  onSave,
  loading,
  employee,
  companyWorkingHours
}: CategoryWorkingHoursModalProps) {
  return (
    <WorkingHoursModal
      visible={visible}
      onClose={onClose}
      title="Configurar Horários"
      subtitle={category?.name}
      initialHours={initialHours}
      onSave={onSave}
      loading={loading}
      type="category"
      employee={employee}
      companyWorkingHours={companyWorkingHours}
    />
  );
}