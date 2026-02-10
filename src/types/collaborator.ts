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
  position: string;
  department: string;
  admissionDate: string;
  status: 'active' | 'inactive';
  avatar?: string;
}
