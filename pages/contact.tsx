// Eksternal
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormHelperText,
  FormLabel,
  Input,
} from '@chakra-ui/react';
import { NextSeo } from 'next-seo';
import { useRef } from 'react';

// Internal
import { useColors } from '@hooks';

const Contact = () => {
  const form = useRef(null);

  const handleSubmitForm = event => {
    event.preventDefault();
    const feedback = new FormData(form.current);

    fetch(
      'https://script.google.com/macros/s/AKfycbx-JUKUUL4kQDDhmlzpElo-eY5YDBwkYvgAK3b-EIxFoCV3KZqD2CuvccMouYz4TTi8/exec',
      {
        method: 'POST',
        body: feedback,
      }
    )
      .then(response => console.log('Success!', response))
      .catch(error => console.error('Error!', error.message));
  };

  // Dark/light mode colors
  const { bgButtonHighlight, textLight } = useColors();

  return (
    <>
      {/* Head */}
      <NextSeo
        title="Muslim • Kritik dan Saran"
        description="Silakan sampaikan kritik dan saran."
      />
      <Box height="100vh">
        <form ref={form} onSubmit={handleSubmitForm}>
          <Flex direction="column" p={5} sx={{ gap: 30 }}>
            <FormControl id="name" isRequired>
              <FormLabel m={0}>Nama</FormLabel>
              <Input name="name" type="text" variant="flushed" />
            </FormControl>
            <FormControl id="email" isRequired>
              <FormLabel m={0}>Email</FormLabel>
              <Input name="email" type="email" variant="flushed" />
            </FormControl>
            <FormControl id="message" isRequired>
              <FormLabel m={0}>Pesan</FormLabel>
              <Input name="message" type="textarea" variant="flushed" />
              <FormHelperText>
                Silakan sampaikan kritik atau saran.
              </FormHelperText>
            </FormControl>
            <Button
              type="submit"
              color={textLight}
              bg={bgButtonHighlight}
              _hover={{ bg: bgButtonHighlight }}
            >
              Kirim
            </Button>
          </Flex>
        </form>
      </Box>
    </>
  );
};

export default Contact;
