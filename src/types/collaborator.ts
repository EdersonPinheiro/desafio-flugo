export interface Collaborator {
  id?: string;
  name: string;
  email: string;
  cpf: string;
  phone: string;
  cep: string;
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  jobTitle: string;
  departmentId: string;
  department?: string;
  departmentName?: string;
  admissionDate: string;
  level: 'junior' | 'pleno' | 'senior' | 'manager';
  managerId?: string;
  managerName?: string;
  baseSalary: number;
  status: 'active' | 'inactive';
  avatar?: string;
}
