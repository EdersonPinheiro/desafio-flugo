export interface Department {
    id?: string;
    name: string;
    managerId?: string; // Responsible manager ID
    managerName?: string; // Responsible manager Name (for display optimization)
    collaboratorIds: string[]; // List of collaborator IDs belonging to this department
}
