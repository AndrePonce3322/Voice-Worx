import { Component } from "@angular/core";

@Component({
    selector: 'record-audio-app',
    templateUrl: './Recordaudio.component.html',
    styleUrls: ['./Recordaudio.component.css']
})

export class RecordAudioComponent{

    // Variables Elemento Doom
    grabando!: boolean;
    continuar = false;
    pausar = false;
    terminar = false;
    repetir = false;

    // Data del audio
    mediaRecorder!: MediaRecorder;
    allChunks: Blob[] = [];
    audioURL!:string;


    Grabar() {
        this.grabando = true;
        this.terminar = false;

        navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {

            // Dandole el atributo stream
            this.mediaRecorder = new MediaRecorder(stream);

            this.mediaRecorder.start();

            // Chuncks
            this.mediaRecorder.addEventListener('dataavailable', (event) => {
                this.allChunks.push(event.data)
            })

        }).catch((error) => {
            console.log(error);
            this.grabando = false;
        })

    }

    Pausar() {
        this.pausar = true;
        this.mediaRecorder.pause();

        const wave = document.querySelectorAll('.box');

        for (let i = 0; i < wave.length; i++) {
            wave[i].classList.add('ceroAnimate');
        }

    }

    Continuar() {
        this.continuar = true;
        this.pausar = false;

        const wave = document.querySelectorAll('.box');

        for (let i = 0; i < wave.length; i++) {
            wave[i].classList.remove('ceroAnimate');
        }

        this.mediaRecorder.resume();
    }

    Terminar(audio: HTMLAudioElement) {
        this.repetir = true;
        this.terminar = true;

        const audioBlob = new Blob(this.allChunks);

        const audioURL = URL.createObjectURL(audioBlob);

        this.audioURL = audioURL;

        audio.src = audioURL;

        this.mediaRecorder.stop();
    }

    Repetir() {
        this.Grabar();
    }
}