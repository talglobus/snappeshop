package com.example.yishanlin.cameraintent;

import android.os.Environment;
import android.provider.MediaStore;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.view.Menu;
import android.view.MenuItem;
import android.view.View;

import java.io.ByteArrayOutputStream;
import java.io.File;
import android.widget.ImageView;
import android.graphics.Bitmap;

import android.content.Intent;
import android.net.Uri;



import android.widget.Toast;

public class MainActivity extends AppCompatActivity {

    private static final int ACTIVITY_START_CAMERA_APP = 1;
    private File imageFile;
    private ImageView PhotoCapturedImage;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        PhotoCapturedImage = (ImageView) findViewById(R.id.capturedphoto);
    }


    public void takephoto(View view) {
       Toast.makeText(this, "camera button pressed!", Toast.LENGTH_SHORT).show();
        Intent callCamera = new Intent();
        callCamera.setAction(MediaStore.ACTION_IMAGE_CAPTURE);

        imageFile = new File(Environment.getExternalStoragePublicDirectory(Environment.DIRECTORY_PICTURES),"test.jpg");
        Uri tempUri = Uri.fromFile(imageFile);
        //callCamera.putExtra(MediaStore.EXTRA_OUTPUT,tempUri);
        //callCamera.putExtra(MediaStore.EXTRA_VIDEO_QUALITY,1);

        System.out.println(returnUri(imageFile));


        //problem in converting URI



        //this line causes problems

        startActivityForResult(callCamera,ACTIVITY_START_CAMERA_APP);

    }

 //this produces the bitmap
    public void onActivityResult(int requestCode, int resultCode, Intent data) {

        if (requestCode == ACTIVITY_START_CAMERA_APP && resultCode == RESULT_OK) {

            Bundle extras = data.getExtras();
            Bitmap photoCapturedBitmap = (Bitmap) extras.get("data");
            PhotoCapturedImage.setImageBitmap(photoCapturedBitmap);

        }

    }
    
    
//WE AREN'T SURE THAT THIS WORKS. Not sure if returning yourUri.

    public Uri returnUri(File imageFile) {

        String PATH = Environment.getExternalStorageDirectory().getPath();
        File f = new File(PATH);
        Uri yourUri = Uri.fromFile(f);

       return yourUri;

        /*String picName = "pic.jpg";
        String PATH = Environment.getExternalStorageDirectory().getPath()+ picName;
        File f = new File(PATH);
        Uri yourUri = Uri.fromFile(f);*/


    }
    

    /*
    String PATH = Environment.getExternalStorageDirectory().getPath()+ picName;
    File f = new File(PATH);
    Uri yourUri = Uri.fromFile(f);*/

    //convert bitmap to URI


}


/*public Uri getImageUri(Context inContext, Bitmap inImage) {
  ByteArrayOutputStream bytes = new ByteArrayOutputStream();
  inImage.compress(Bitmap.CompressFormat.JPEG, 100, bytes);
  String path = Images.Media.insertImage(inContext.getContentResolver(), inImage, "Title", null);
  return Uri.parse(path);
}*/
