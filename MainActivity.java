package com.example.yishanlin.cameraintent;

import android.os.Environment;
import android.provider.MediaStore;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.view.Menu;
import android.view.MenuItem;
import android.view.View;
import java.io.File;

import android.content.Intent;
import android.net.Uri;


import android.widget.Toast;

public class MainActivity extends AppCompatActivity {

    private static final int ACTIVITY_START_CAMERA_APP = 1;
    private File imageFile;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
    }


    public void takephoto(View view) {
       Toast.makeText(this, "camera button pressed!", Toast.LENGTH_SHORT).show();
        Intent callCamera = new Intent();
        callCamera.setAction(MediaStore.ACTION_IMAGE_CAPTURE);

        imageFile = new File(Environment.getExternalStoragePublicDirectory(Environment.DIRECTORY_PICTURES),"test.jpg");
        Uri tempUri = Uri.fromFile(imageFile);


        //callCamera.putExtra(MediaStore.EXTRA_OUTPUT,tempUri); this line causes problems

        startActivityForResult(callCamera,ACTIVITY_START_CAMERA_APP);

    }

}
