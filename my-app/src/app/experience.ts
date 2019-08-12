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
        description: 'I am currently a Software Engineer with SRC Inc. Upon starting at SRC Inc I quickly became the tech lead' +
            ' on multiple software projects and continue to lead the development of high quality, stable and reliable software.',
        bullets: [
            'Lead the migration of a monolith project to a microservices architecture utilizing a range of frameworks; Spring Cloud, JSX, Hibernate, JPA, CSS',
            'Developed cutting edge technologies in order to increase the accesability of complex data sources',
            'Lead the development of analyst tools utilizing Agile methodologies to deliver innovative solutions for unifying disparate data sources',
            'Generated reports and communicate project status to government oversight'
        ],
        technologies: [
            'Spring Boot',
            'Spring Security',
            'Spring Cloud',
            'JQuery',
            'D3',
            'ThreeJS',
            'JSTL',
            'HTML',
            'Javascript',
            'Hibernate',
            'JPA',
            'JBoss Server',
            'Tomcat Server',
            'CSS',
            'SVN'
        ],
        timeframe: '2018 - Now'
    },
    {
        company: 'AMRDEC',
        title: 'Computer Scientist',
        description: 'As a Computer Scientist with AMRDEC I took on the responsabilities of quickly learning and applying new technologies to diverse problems while continueing the development and maintaining of existing projects.',
        bullets: [
            'Develop analyst tools utilizing GraphQL, Cesium, D3, and Spring successfully deprecated existing multimillion dollar application for the Missile Defense Agency', 
            'Utilize Agile methodologies in order to quickly and efficiently produce functioning replacement of obsolete system', 
            'Implement data virtualization REST API utilizing GraphQL and Hibernate providing a single consolidated and uniform source of all disparate digital simulation data', 
            'Collaborate closely with other team members to plan, design and develop solutions',
            'Development significant contributions utilizing MVC architecture, .Net, C#, Javascript, JQuery, AJAX, MsSQL, HTML5, Telerik, and CSS',
            'Manage development team utilizing Agile/Scrum methodology',
            'Generated reports to communicate project status to leadership ',
            'Perform code reviews and tests ensuring the reliability of modified functionality',
            'Implement Counter Intelligence tool with capabilities to increase productivity ten fold using Neo4J, OpenNLP, and CoreNLP',
			'Investigate data science technologies not being utilized by the federal government',
			'Maintain and control virtual environments using Docker, VirtualBox and Linux Containers'
        ],
        technologies: ['Java', 'C#', '.Net', 'Javascript', 'JQuery', 'Kendo', 'CSS', 'MsSql', 'Neo4J', 'OpenNLP', 'Git', 'GraphQL', 'D3', 'HTML'],
        timeframe: '2016 - 2018',
    },
    {
        company: 'University of New Mexico',
        title: 'Software Engineer',
        description: 'Worked with Psychology department profesor to develop game which interacted with EEG recording machine.',
        bullets: [
			'Developed side scroller shoot which included dunamicly generated enviroment and provided high fedality logging functionality',
			'Developed C utility to interact through a parallel port with the EEG machine',
			'Resulting application is actively being used to conduct EEG research'
		],
        technologies: ['Java', 'C'],
        timeframe: '2014 - 2016',
    }
];
