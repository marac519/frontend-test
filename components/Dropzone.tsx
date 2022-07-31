import { useRef } from 'react';
import { Text, Group, Button, createStyles } from '@mantine/core';
import { Dropzone, MIME_TYPES } from '@mantine/dropzone';
import { IconCloudUpload, IconX, IconDownload, IconCircleCheck } from '@tabler/icons';

import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import { addDoc, collection, serverTimestamp  } from "firebase/firestore";
import { app, db } from './../pages/_app' 
import useAppStore from '../store/useAppStore';
import { showNotification, cleanNotifications } from '@mantine/notifications';

const useStyles = createStyles((theme) => ({
  wrapper: {
    position: 'relative',
    marginBottom: 30,
  },

  dropzone: {
    borderWidth: 1,
    paddingBottom: 50,
  },

  icon: {
    color: theme.colorScheme === 'dark' ? theme.colors.dark[3] : theme.colors.gray[4],
  },

  control: {
    position: 'absolute',
    width: 250,
    left: 'calc(50% - 125px)',
    bottom: -20,
  },
}));



export function DropzoneButton() {
  const user = useAppStore((state:any) => state.user)
  const { classes, theme } = useStyles();
  const openRef = useRef<() => void>(null);

  async function uploadImageToFirebase(file:File){
    showNotification({
      styles: (theme) => ({
        root: {
          backgroundColor: 'white',
          borderColor: theme.colors.blue[6],

          '&::before': { backgroundColor: theme.white },
        },

        title: { color: theme.white },
        description: { color: theme.white },
        closeButton: {
          color: theme.white,
          '&:hover': { backgroundColor: theme.colors.blue[7] },
        },
      }),
      message: "Uploading...",
      loading: true
    })
    
    console.log("file mit kaptam", file )
    
    //try {
      const storage = getStorage();
      console.log(file.name)
      const storageRef = ref(storage, file.name);
      const result = await uploadBytes(storageRef, file).then((snapshot) => {
        console.log('Uploaded a blob or file!:');
      });
      console.log(result)
  
      const url = await getDownloadURL(ref(storage, `gs://frontend-test-e15e4.appspot.com/${file.name}`))
      console.log("url:", url)
      console.log("user.uid:",user.uid)
      
      const docRef = await addDoc(collection(db, "images"), {
        userId: `${user.uid}`,
        imageURL: `${url}`,
        created_at: serverTimestamp(),
      });
      cleanNotifications()
      setTimeout(() => {
        showNotification({
          title: 'Successfull upload 🥳',
          message: 'You can view your uploaded images on the Home page!',
          icon: <IconCircleCheck/>,
          autoClose: 5000,
          style: {'background': 'white'},
          styles: (theme) => ({
            root: {
              backgroundColor: 'white',
              borderColor: '#198754',
              '&::before': { backgroundColor: 'white' },
            },
            title: { color: theme.black },
            description: { color: theme.black },
            closeButton: {
              color: theme.black,
              '&:hover': { backgroundColor: '#198754 !important' },
            },
          })
        })
      }, 300);
    // } catch (error) {
    //   console.log(error)
    //   cleanNotifications()
    //   setTimeout(() => {
    //     showNotification({
    //       title: 'Error 🤥',
    //       message: 'Cannot upload the photo!',
    //       autoClose: 5000,
    //       styles: (theme) => ({
    //         root: {
    //           backgroundColor: 'white',
    //           borderColor: 'red',
    //           '&::before': { backgroundColor: 'red' },
    //         },
    //         title: { color: theme.black },
    //         description: { color: theme.black },
    //         closeButton: {
    //           color: theme.black,
    //           '&:hover': { backgroundColor: 'red !important' },
    //         },
    //       })
    //     })
    //   }, 300);
    // }
  }

  return (
    <div className={classes.wrapper} id={'dropzone'}>
      <Dropzone
        onDrop={(files) => uploadImageToFirebase(files[0])}
        onReject={(files) => console.log('rejected files', files[0])}
        openRef={openRef}
        className={classes.dropzone}
        radius="md"
        accept={[MIME_TYPES.jpeg, MIME_TYPES.png, MIME_TYPES.webp]}
        maxSize={30 * 1024 ** 2}
      >
        <div style={{ pointerEvents: 'none' }}>
          <Group position="center">
            <Dropzone.Accept>
              <IconDownload size={50} color={theme.colors[theme.primaryColor][6]} stroke={1.5} />
            </Dropzone.Accept>
            <Dropzone.Reject>
              <IconX size={50} color={theme.colors.red[6]} stroke={1.5} />
            </Dropzone.Reject>
            <Dropzone.Idle>
              <IconCloudUpload
                size={50}
                color={theme.colorScheme === 'dark' ? theme.colors.dark[0] : theme.black}
                stroke={1.5}
              />
            </Dropzone.Idle>
          </Group>

          <Text align="center" weight={700} size="lg" mt="xl">
            <Dropzone.Accept>Drop files here</Dropzone.Accept>
            <Dropzone.Reject>Jpeg, Png, and Webp files less than 30mb</Dropzone.Reject>
            <Dropzone.Idle>Upload your image</Dropzone.Idle>
          </Text>
          <Text align="center" size="sm" mt="xs" color="dimmed">
            Drag&apos;n&apos;drop files here to upload. We can accept only <i>.png</i>, <i>.jpeg</i>, and <i>.webp</i> files that
            are less than 30mb in size.
          </Text>
        </div>
      </Dropzone>

      <Button className={classes.control} size="md" radius="xl" onClick={() => openRef.current?.()}>
        Select file
      </Button>
    </div>
  );
}