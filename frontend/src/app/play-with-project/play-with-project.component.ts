import { ChangeDetectorRef, Component, HostListener } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Project } from "src/models/project";
import { PipelineLaunchedSignal } from "src/models/signals/launch";
import { SignalsService } from "src/services/signals.service";
import { PopoverComponent } from "../../ui-kit/popover/popover.component";

@Component({
  selector: "app-play-with-project",
  templateUrl: "./play-with-project.component.html",
  styleUrls: ["./play-with-project.component.scss"],
})
export class PlayWithProjectComponent {
  project!: Project;

  instances: { popopver?: PopoverComponent } = { popopver: null };

  constructor(
    private route: ActivatedRoute,
    private signals: SignalsService,
    private router: Router,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.route.data.subscribe(({ project }) => {
      this.project = project;
      this.cd.detectChanges();
    });

    this.signals.feed.subscribe((event) => {
      if (event instanceof PipelineLaunchedSignal) {
        this.router.navigate(["./"], {
          relativeTo: this.route,
        });
      }
    });
  }

  go(project: Project) {
    this.router.navigate(["..", project._id], { relativeTo: this.route });
    this.instances.popopver?.hide();
  }

  @HostListener("window:keydown", ["$event"])
  close(event: KeyboardEvent): void {
    if (event.key === "Escape") {
      this.router.navigate(["./"], { relativeTo: this.route });
    }
  }
}
