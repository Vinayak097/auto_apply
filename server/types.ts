interface JD{
    id:string,
    jobTitle:string,
    skills:{
        required:string[],
        extraoptional:string[]
    },
    exprince:Exprience,
    education:JDEducation,
      responsibilities: string[];
    seniority:string;
  location: string | null;
    rawDescription:string,
    jobType:JobType,
}

enum JobType{
    Internship="internship",
    Job="job",
    Contract="contract"    
}
interface JDEducation {
  degree: string | null;
  domain: string | null;

  graduationYear: {
    min: number | null;
    max: number | null;
  };
}
interface Education {
    degree:string,
    grduation_year:number,
    domain:string
}

interface Exprience{
    min:number,
    max:number
}

interface Resume{
      id: string;

  personal: {
    name: string;
    email?: string;
    phone?: string;
    location?: string;

    linkedin?: string;
    github?: string;
    portfolio?: string;
  };

  summary?: string;
    skills: String[];
    experience: R_Experience[];
    projects: Project[];
    education: Education[];
    certifications?: String[];
}
interface Project {
  title: string;
  githubLink?: string;
  live?: string;
  description: string[];
  technologies: string[];
}
interface R_Experience {
  company: string;
  role: string;
  durationMonths: number;
  description: string[];
  technologies: string[];
}

