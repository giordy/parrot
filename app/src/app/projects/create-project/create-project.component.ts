import { Component, Input } from '@angular/core';

import { ProjectsService } from './../services/projects.service';

@Component({
    selector: 'create-project',
    templateUrl: './create-project.component.html'
})
export class CreateProjectComponent {
    constructor(private projectsService: ProjectsService) {
        // this.onSubmit = this.onSubmit.bind(this);
    }

    onSubmit(project) {
        this.projectsService.createProject(project).subscribe(
            res => { },
            err => { },
        )
    }
}