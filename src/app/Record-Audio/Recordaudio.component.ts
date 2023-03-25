import { Component } from "@angular/core";
import { DomSanitizer } from "@angular/platform-browser";

@Component({
    selector: 'record-audio-app',
    templateUrl: './Recordaudio.component.html',
    styleUrls: ['./Recordaudio.component.css']
})

export class RecordAudioComponent {

    // Variables Elemento Doom
    grabando!: boolean;
    continuar = false;
    pausar = false;
    terminar = false;
    repetir = false;
    audio_upload = false;

    // Temporizador
    time!: string;
    SetInterval: any;
    minutos = 0;
    segundos = 0;
    horas = 0;

    // Data del audio
    mediaRecorder!: MediaRecorder;
    audiosAlmacenados: any[] = [];
    allChunks: Blob[] = [];
    audioURL!: string;
    audioBlob: any;
    duracion: string[] = [];
    fileName!: string;

    constructor(private domSanitizer: DomSanitizer) { }
    sanitize(url: string) {
        return this.domSanitizer.bypassSecurityTrustUrl(url);
    }

    Grabar() {
        this.grabando = true;
        this.terminar = false;
        this.time = `00:00:00s`;
        clearInterval(this.SetInterval);

        navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {

            // Dandole el atributo stream
            this.mediaRecorder = new MediaRecorder(stream);

            // Start recording
            this.mediaRecorder.start();
            this.Temporizador();

            // Taking all data from chuncks.
            this.mediaRecorder.addEventListener('dataavailable', (event) => {
                this.allChunks.push(event.data);
            })

            // Stop
            this.mediaRecorder.addEventListener('stop', () => {
                this.audioBlob = new Blob(this.allChunks, { type: 'audio/mp3' });
                this.audioURL = URL.createObjectURL(this.audioBlob);
                // Almacenar Audios
                this.audiosAlmacenados.push(this.audioURL);

            })

        }).catch((error) => {
            // If permission or an error ocurrer.
            this.grabando = false;
        })
    }

    Pausar() {
        this.pausar = true;
        this.mediaRecorder.pause();

        // Taking all values of wave and stoping them.
        const wave = document.querySelectorAll('.box');
        const icon_record = document.getElementById('record-icon') as HTMLElement;

        icon_record.classList.add('ceroAnimate');
        for (let i = 0; i < wave.length; i++) {
            wave[i].classList.add('ceroAnimate');
        }
        clearInterval(this.SetInterval);
    }

    Continuar() {
        this.continuar = true;
        this.pausar = false;

        // Taking all Values of the waves from HTML.
        const wave = document.querySelectorAll('.box');
        const icon_record = document.getElementById('record-icon') as HTMLElement;

        icon_record.classList.remove('ceroAnimate');
        for (let i = 0; i < wave.length; i++) {
            wave[i].classList.remove('ceroAnimate');
        }
        // Continuando temporizador 
        this.Temporizador();

        // Continuando grabación
        this.mediaRecorder.resume();
    }
    Terminar() {
        // Taking Value of the icon from HTML.
        const icon_record = document.querySelector('#record-icon') as HTMLElement;
        icon_record.classList.add('ceroAnimate');

        // Finishing 
        this.repetir = true;
        this.terminar = true;
        this.mediaRecorder.stop();
        this.TerminarTemporizador();
    }

    Repetir() {
        // Taking Value of the icon from HTML.
        const icon_record = document.querySelector('#record-icon') as HTMLElement;
        icon_record.classList.remove('ceroAnimate');

        // Reset DATA
        this.allChunks = [];
        this.audioURL = "";

        // Reset Variables
        this.terminar = true;
        this.grabando = true;
        this.continuar = true;
        this.repetir = false;

        // Starting Again
        this.mediaRecorder.start();
        this.Grabar();
    }

    GrabarDespuesDeSubirArchivo() {
        // Reset DATA
        this.allChunks = [];
        this.audioURL = "";

        // Reset Variables
        this.terminar = true;
        this.grabando = true;
        this.continuar = true;
        this.repetir = false;

        // Starting Again
        this.Grabar();
        this.mediaRecorder.start();
    }


    Temporizador() {
        let cond_segundos;
        let cond_minutos;
        let cond_horas;
        let resultado;

        const Repetir = () => {
            this.segundos++;
            cond_segundos = (this.segundos < 10 ? `0${this.segundos}` : this.segundos);
            cond_minutos = (this.minutos < 10 ? `0${this.minutos}` : this.minutos);
            cond_horas = (this.horas < 10 ? `0${this.horas}` : this.horas)

            if (this.segundos >= 60) {
                this.minutos++;
                this.segundos = 0;
            }

            else if (this.minutos >= 60) {
                this.horas++;
            }
            resultado = `${cond_horas}:${cond_minutos}:${cond_segundos}s`

            this.time = resultado;
        }
        this.SetInterval = setInterval(() => {
            Repetir();
        }, 1000);
    }

    // Terminando temporizador
    TerminarTemporizador() {
        // Almecenando la duración
        this.duracion.push(`Tiempo: ${this.time}`);

        this.minutos = 0;
        this.segundos = 0;
        this.horas = 0;
        clearInterval(this.SetInterval);
    }

    // Menu de audios
    mostrarAudios!: boolean;
    MostrarAudios() {
        const menu = document.querySelector('.menu') as HTMLElement;
        const mostrarAudios = document.querySelector('.audiosAlmacenados') as HTMLElement;

        this.mostrarAudios = !this.mostrarAudios;
        if (this.mostrarAudios == true) {
            mostrarAudios.style.left = '0px';
            menu.style.zIndex = '2';
        } else {
            mostrarAudios.style.left = '-100%';
            menu.style.zIndex = '0';
        }
    }

    Subir(evento: any) {
        const file = evento.target.files[0];

        this.fileName = file.name;
        this.audioURL = URL.createObjectURL(file);

        // Almacenando datos subidos
        this.audiosAlmacenados.push(this.audioURL);
        this.duracion.push(`${this.fileName}`);

        this.time = '';
        this.grabando = true;
        this.terminar = true;
        this.continuar = false;
        this.pausar = false;
        this.repetir = false;
        this.audio_upload = true;
    }

}