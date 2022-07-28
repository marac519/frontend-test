import { useRef } from 'react';
import { Text, Group, Button, createStyles } from '@mantine/core';
import { Dropzone, MIME_TYPES } from '@mantine/dropzone';
import { IconCloudUpload, IconX, IconDownload } from '@tabler/icons';

import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import { doc, setDoc } from "firebase/firestore";
import { db } from './../pages/_app' 
import useAppStore from '../store/useAppStore';

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
    const storage = getStorage();
    const storageRef = ref(storage, file.name);

    console.log("file mit kaptam", file)

    const result = await uploadBytes(storageRef, file).then((snapshot) => {
      console.log('Uploaded a blob or file!:');
    });
    console.log(result)

    const url = await getDownloadURL(ref(storage, `gs://bucket/${file.name}`))
    await setDoc(doc(db, "images"), {
      userId: `${user.uid}`,
      imageURL: ``
    });
  }

  return (
    <div className={classes.wrapper}>
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
            <Dropzone.Idle>Upload resume</Dropzone.Idle>
          </Text>
          <Text align="center" size="sm" mt="xs" color="dimmed">
            Drag&apos;n&apos;drop files here to upload. We can accept only <i>.png</i>, <i>.jpeg</i>, and <i>.webp</i> files that
            are less than 30mb in size.
          </Text>
        </div>
      </Dropzone>

      <Button className={classes.control} size="md" radius="xl" onClick={() => openRef.current?.()}>
        Select files
      </Button>
    </div>
  );
}