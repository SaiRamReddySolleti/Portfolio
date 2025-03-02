import React from 'react';

interface TimelineItem {
  type: 'education' | 'experience';
  title: string;
  organization: string;
  date: string;
  location?: string;
  description?: string;
  skills?: string[];
}

const educationItems: TimelineItem[] = [
  {
    type: 'education',
    title: 'Masters of Science in Applied Artificial Intelligence',
    organization: 'Purdue University Northwest, Hammond, IN 46323, USA',
    date: 'Jan 2025 - Dec 2026',
    description: 'Masters of Science in Applied Artificial Intelligence',
    skills: ['Machine Learning', 'Deep Learning', 'Data Analysis', 'Python', 'Artificial Intelligence', 'Research']
  },
  {
    type: 'education',
    title: 'Bachelors of Technology (CSE-Networks)',
    organization: 'Kakatiya Institute of Technology and Science, Hasanparthy, Warangal',
    date: '2020 - 2024',
    description: 'Computer Science and Engineering with specialization in Networks, grade achieved 8.3 CGPA',
    skills: ['Networking', 'C Programming', 'Java', 'Database Management', 'Algorithms', 'Data Structures']
  }
];

const experienceItems: TimelineItem[] = [
  {
    type: 'experience',
    title: 'Process Associate',
    organization: 'Genpact',
    date: 'July 2005 - Sept 2002',
    location: 'Hyderabad, India', 
    description: 'Liaised with cross-functional teams to address discrepancies, ensuring the prompt and adequate resolution of customer queries. Assisted in the implementation of new systems, policies, and processes, contributing to their successful adoption, and driving operational improvements.',
    skills: ['Cross-functional Team Collaboration', 'Process Improvement', 'System Implementation', 'Operational Efficiency', 'Problem Solving']
  }
];
const TimelineItem: React.FC<{ item: TimelineItem }> = ({ item }) => (
  <div className="mb-8 relative">
    <div className="absolute top-0 left-0 w-2 h-full bg-gray-200 dark:bg-gray-700" />
    <div className="ml-6 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md">
      <div className="absolute left-0 top-4 w-6 h-6 bg-blue-500 rounded-full border-4 border-white dark:border-gray-800" />
      <h3 className="text-lg font-medium text-gray-900 dark:text-white">{item.title}</h3>
      <p className="text-sm text-gray-600 dark:text-gray-400">{item.organization}</p>
      <p className="text-sm text-gray-500 dark:text-gray-500">{item.date}</p>
      {item.location && (
        <p className="text-sm text-gray-500 dark:text-gray-500">{item.location}</p>
      )}
      {item.description && (
        <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">{item.description}</p>
      )}
      {item.skills && (
        <div className="mt-2 flex flex-wrap gap-2">
          {item.skills.map((skill, index) => (
            <span key={index} className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">
              {skill}
            </span>
          ))}
        </div>
      )}
    </div>
  </div>
);

const Timeline: React.FC = () => {
  return (
    <div className="max-w-6xl mx-auto p-4 bg-gray-100 dark:bg-gray-900 rounded-lg shadow">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-900 dark:text-white">Timeline</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Experience</h2>
          {experienceItems.map((item, index) => (
            <TimelineItem key={index} item={item} />
          ))}
        </div>
        <div>
          <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Education</h2>
          {educationItems.map((item, index) => (
            <TimelineItem key={index} item={item} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Timeline;