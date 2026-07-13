import { Injectable } from '@angular/core';
import { Plugins, CameraResultType, CameraSource, CameraPhoto } from '@capacitor/core';

const { Camera } = Plugins;

@Injectable({
  providedIn: 'root'
})
export class CameraService {

  constructor() {}

  /**
   * Abre la cámara nativa (o el selector de galería) y devuelve la foto
   * como base64, lista para guardarse en ServiceRequest.photoUrl.
   * Reto técnico: "carga de foto de evidencia con Capacitor Camera".
   */
  async takeEvidencePhoto(): Promise<string> {
    try {
      const photo: CameraPhoto = await Camera.getPhoto({
        quality: 70,
        allowEditing: false,
        resultType: CameraResultType.Base64,
        source: CameraSource.Prompt, // deja elegir entre cámara o galería
        width: 1024,
        saveToGallery: false
      });

      return `data:image/${photo.format};base64,${photo.base64String}`;
    } catch (error) {
      // El usuario canceló o no hay permisos: lo tratamos como "sin foto" en vez de romper el flujo.
      console.warn('No se pudo capturar la foto de evidencia', error);
      throw error;
    }
  }

  /**
   * Solicita permisos explícitamente antes de mostrar el botón de cámara,
   * útil para dar feedback ("Activa el permiso de cámara en ajustes") en vez
   * de fallar en silencio.
   */
  async ensurePermissions(): Promise<boolean> {
    try {
      const status = await Camera.checkPermissions();
      if (status.camera === 'granted') {
        return true;
      }
      const requested = await Camera.requestPermissions();
      return requested.camera === 'granted';
    } catch (error) {
      console.warn('No se pudo verificar permisos de cámara', error);
      return false;
    }
  }
}
