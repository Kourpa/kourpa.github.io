export class Experience {
    company: string;
    title: string;
    description: string;
    bullets: Array<string>;
    technologies: Array<string>;
    timeframe: string;
}

export const EXPERIENCES = [
    {
        company: 'SRC Inc',
        title: 'Software Engineer',
        description: 'At SRC Inc I have taken the role of Senior ' +
            'Software Engineer. Taking on the responsibility of developing, ' +
            'deployment and tasking of large software applications',
        bullets: [
            'Lead the development of analyst tools utilizing Agile methodologies to deliver innovative solutions for unifying disparate data sources', 
            'Provide critical support to a variety of projects utilizing a range of frameworks; Spring Boot, NodeJS, Java SE, Eclipse Modeling Framework',
            'Generated reports and communicate project status to government oversight', 
        ],
        technologies: [
            'Spring Boot',
            'Spring Security',
            'Spring Cloud',
            'JQuery',
            'JSTL',
            'HTML',
            'Javascript',
            'Hibernate',
            'JPA',
            'JBoss Server',
            'Tomcat Server',
            'CSS'
        ],
        timeframe: '2018 - Now',
    },
    {
        company: 'AMRDEC',
        title: 'Computer Scientist',
        description: 'Did some stuff',
        bullets: ['some', 'stuff', 'that', 'i', 'did'],
        technologies: ['tech a', 'tech b'],
        timeframe: '2016 - 2018',
    },
    {
        company: 'University of New Mexico',
        title: 'Software Engineer',
        description: 'Did some stuff',
        bullets: ['some', 'stuff', 'that', 'i', 'did', 'stuff', 'that', 'i', 'did', 'stuff', 'that', 'i', 'did', 'stuff', 'that', 'i', 'did'],
        technologies: ['tech a', 'tech b'],
        timeframe: '2014 - 2016',
    },
    {
        company: 'University of New Mexico',
        title: 'Software Engineer',
        description: 'Did some stuff',
        bullets: ['some', 'stuff', 'that', 'i', 'did'],
        technologies: ['tech a', 'tech b'],
        timeframe: '2014 - 2016',
    },
];
