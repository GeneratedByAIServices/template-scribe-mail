
export interface Recipient {
  id: string;
  name: string;
  position: string;
  role: string;
  department?: string;
  email: string;
}

export const recipients: Recipient[] = [
  {
    id: '1',
    name: '홍길동',
    position: '선임',
    role: '개발자',
    email: 'hong@company.com'
  },
  {
    id: '2',
    name: '을지문덕',
    position: '수석',
    role: '개발자',
    department: '팀장',
    email: 'moonduck@company.com'
  },
  {
    id: '3',
    name: '강감찬',
    position: '전무이사',
    role: '개발자',
    department: '사업부장',
    email: 'gang@company.com'
  },
  {
    id: '4',
    name: '이순신',
    position: '부장',
    role: '기획자',
    department: '기획팀장',
    email: 'sunsin@company.com'
  },
  {
    id: '5',
    name: '김유신',
    position: '과장',
    role: '디자이너',
    email: 'yushin@company.com'
  }
];
