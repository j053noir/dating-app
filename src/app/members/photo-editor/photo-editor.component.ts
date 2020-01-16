import {
    Component,
    EventEmitter,
    Input,
    OnDestroy,
    OnInit,
    Output,
} from '@angular/core';
import { FileUploader } from 'ng2-file-upload';
import { Subscription } from 'rxjs';
import { Photo } from 'src/app/_models/photo';
import { AlertifyService } from 'src/app/_services/alertify.service';
import { AuthService } from 'src/app/_services/auth.service';
import { UserService } from 'src/app/_services/user.service';
import { environment } from 'src/environments/environment';

@Component({
    selector: 'app-photo-editor',
    templateUrl: './photo-editor.component.html',
    styleUrls: ['./photo-editor.component.scss'],
})
export class PhotoEditorComponent implements OnInit, OnDestroy {
    @Input() photos: Photo[];
    @Output() getMemberPhotoChanged = new EventEmitter<string>();

    uploader: FileUploader;
    hasBaseDropZoneOver = false;
    mainPhotoSubscription: Subscription;

    constructor(
        private authService: AuthService,
        private userService: UserService,
        private alertify: AlertifyService
    ) {}

    ngOnInit() {
        this.initializeUploader();
    }

    ngOnDestroy() {
        if (this.mainPhotoSubscription) {
            this.mainPhotoSubscription.unsubscribe();
        }
    }

    fileOverBase(e) {
        this.hasBaseDropZoneOver = e;
    }

    initializeUploader() {
        this.uploader = new FileUploader({
            url: `${environment.apiUrl}/users/${this.authService.decodedToken.nameid}/photos`,
            authToken: `Bearer ${localStorage.getItem(environment.tokenName)}`,
            isHTML5: true,
            allowedFileType: ['image'],
            removeAfterUpload: true,
            autoUpload: false,
            maxFileSize: 10 * 1024 * 1024, // 10 MB
        });

        this.uploader.onAfterAddingFile = file => {
            file.withCredentials = false;
        };

        this.uploader.onSuccessItem = (item, response, status, headers) => {
            if (response) {
                const res: Photo = JSON.parse(response);
                const photo: Photo = {
                    id: res.id,
                    url: res.url,
                    dateAdded: res.dateAdded,
                    description: res.description,
                    isMain: res.isMain,
                };
                this.photos.push(photo);
            }
        };
    }

    setMainPhoto(photo: Photo) {
        this.mainPhotoSubscription = this.userService
            .setMainPhoto(this.authService.decodedToken.nameid, photo.id)
            .subscribe(
                () => {
                    const index = this.photos.findIndex(p => p.isMain);
                    this.photos[index].isMain = false;
                    photo.isMain = true;
                    this.getMemberPhotoChanged.emit(photo.url);
                },
                err => {
                    this.alertify.error(err);
                }
            );
    }
}
