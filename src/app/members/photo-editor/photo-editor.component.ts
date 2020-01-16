import { Component, Input, OnInit } from '@angular/core';
import { Photo } from 'src/app/_models/photo';
import { FileUploader } from 'ng2-file-upload';
import { environment } from 'src/environments/environment';
import { AuthService } from 'src/app/_services/auth.service';

@Component({
    selector: 'app-photo-editor',
    templateUrl: './photo-editor.component.html',
    styleUrls: ['./photo-editor.component.scss'],
})
export class PhotoEditorComponent implements OnInit {
    @Input() photos: Photo[];
    uploader: FileUploader;
    hasBaseDropZoneOver = false;

    constructor(private authService: AuthService) {}

    ngOnInit() {
        this.initializeUploader();
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
}
