const doas = [
  {
    id: 1,
    title: `Meminta Ampunan dan Rahmat Allah`,
    types: [`quran`],
    contents: [
      {
        id: 1,
        arabic: `<p>رَبِّ إِنِّي أَعُوذُ بِكَ أَنْ أَسْأَلَكَ مَا لَيْسَ لِي بِهِ عِلْمٌ وَإِلَّا تَغْفِرْ لِي وَتَرْحَمْنِي أَكُنْ مِنَ الْخَاسِرِينَ</p>`,
        transliteration: null,
        translation: `Ya Tuhanku, sesungguhnya aku berlindung kepada Engkau dari memohon kepada Engkau sesuatu yang aku tiada mengetahui (hakekat)nya. Dan sekiranya Engkau tidak memberi ampun kepadaku, dan (tidak) menaruh belas kasihan kepadaku, niscaya aku akan termasuk orang-orang yang merugi.`,
        narrator: `QS. Huud: 47`,
      },
      {
        id: 2,
        arabic: `<p>رَبَّنَا آمَنَّا فَاغْفِرْ لَنَا وَارْحَمْنَا وَأَنْتَ خَيْرُ الرَّاحِمِينَ</p>`,
        transliteration: null,
        translation: `Ya Tuhan kami, kami telah beriman, maka ampunilah kami dan berilah kami rahmat dan Engkau adalah Pemberi rahmat Yang Paling Baik.`,
        narrator: `QS. Al Mu’minun: 109`,
      },
      {
        id: 3,
        arabic: `<p>رَبَّنَا اغْفِرْ لَنَا ذُنُوبَنَا وَإِسْرَافَنَا فِي أَمْرِنَا وَثَبِّتْ أَقْدَامَنَا وَانْصُرْنَا عَلَى الْقَوْمِ الْكَافِرِينَ</p>`,
        transliteration: null,
        translation: `Ya Tuhan kami, ampunilah dosa-dosa kami dan tindakan-tindakan kami yang berlebih-lebihan dalam urusan kami dan tetapkanlah pendirian kami, dan tolonglah kami terhadap kaum yang kafir.`,
        narrator: `QS. Al Imran: 147`,
      },
      {
        id: 4,
        arabic: `<p>رَبَّنَا إِنَّنَا آمَنَّا فَاغْفِرْ لَنَا ذُنُوبَنَا وَقِنَا عَذَابَ النَّارِ</p>`,
        transliteration: null,
        translation: `Ya Tuhan kami, sesungguhnya kami telah beriman, maka ampunilah segala dosa kami dan peliharalah kami dari siksa neraka.`,
        narrator: `QS. Al Imran: 16`,
      },
      {
        id: 5,
        arabic: `<p>رَبَّنَا إِنَّنَا سَمِعْنَا مُنَادِيًا يُنَادِي لِلْإِيمَانِ أَنْ آمِنُوا بِرَبِّكُمْ فَآمَنَّا رَبَّنَا فَاغْفِرْ لَنَا ذُنُوبَنَا وَكَفِّرْ عَنَّا سَيِّئَاتِنَا وَتَوَفَّنَا مَعَ الْأَبْرَارِ رَبَّنَا وَآتِنَا مَا وَعَدْتَنَا عَلَى رُسُلِكَ وَلَا تُخْزِنَا يَوْمَ الْقِيَامَةِ إِنَّكَ لَا تُخْلِفُ الْمِيعَادَ</p>`,
        transliteration: null,
        translation: `Ya Tuhan kami, sesungguhnya kami mendengar (seruan) yang menyeru kepada iman, (yaitu): "Berimanlah kamu kepada Tuhanmu", maka kamipun beriman. Ya Tuhan kami, ampunilah bagi kami dosa-dosa kami dan hapuskanlah dari kami kesalahan-kesalahan kami, dan wafatkanlah kami beserta orang-orang yang banyak berbakti. Ya Tuhan kami, berilah kami apa yang telah Engkau janjikan kepada kami dengan perantaraan rasul-rasul Engkau. Dan janganlah Engkau hinakan kami di hari kiamat. Sesungguhnya Engkau tidak menyalahi janji.`,
        narrator: `QS. Al Imran: 193-194`,
      },
      {
        id: 6,
        arabic: `<p>رَبِّ إِنِّي ظَلَمْتُ نَفْسِي فَاغْفِرْ لِي فَغَفَرَ لَهُ إِنَّهُ هُوَ الْغَفُورُ الرَّحِيمُ</p>`,
        transliteration: null,
        translation: `Ya Tuhanku, sesungguhnya aku telah menganiaya diriku sendiri karena itu ampunilah aku”. Maka Allah mengampuninya, sesungguhnya Allah Dialah Yang Maha Pengampun lagi Maha Penyayang.`,
        narrator: `QS. Al Qashash: 16`,
      },
      {
        id: 7,
        arabic: `<p>رَبَّنَا لَا تُؤَاخِذْنَا إِنْ نَسِينَا أَوْ أَخْطَأْنَا رَبَّنَا وَلَا تَحْمِلْ عَلَيْنَا إِصْرًا كَمَا حَمَلْتَهُ عَلَى الَّذِينَ مِنْ قَبْلِنَا رَبَّنَا وَلَا تُحَمِّلْنَا مَا لَا طَاقَةَ لَنَا بِهِ وَاعْفُ عَنَّا وَاغْفِرْ لَنَا وَارْحَمْنَا أَنْتَ مَوْلَانَا فَانْصُرْنَا عَلَى الْقَوْمِ الْكَافِرِينَ</p>`,
        transliteration: null,
        translation: `Ya Tuhan kami, janganlah Engkau hukum kami jika kami lupa atau kami tersalah. Ya Tuhan kami, janganlah Engkau bebankan kepada kami beban yang berat sebagaimana Engkau bebankan kepada orang-orang sebelum kami. Ya Tuhan kami, janganlah Engkau pikulkan kepada kami apa yang tak sanggup kami memikulnya. Beri maaflah kami; ampunilah kami; dan rahmatilah kami. Engkaulah Penolong kami, maka tolonglah kami terhadap kaum yang kafir.`,
        narrator: `QS. Al Baqarah: 286`,
      },
      {
        id: 8,
        arabic: `<p>رَبَّنَا ظَلَمْنَا أَنْفُسَنَا وَإِنْ لَمْ تَغْفِرْ لَنَا وَتَرْحَمْنَا لَنَكُونَنَّ مِنَ الْخَاسِرِينَ</p>`,
        transliteration: null,
        translation: `Ya Tuhan kami, kami telah menganiaya diri kami sendiri, dan jika Engkau tidak mengampuni kami dan memberi rahmat kepada kami, niscaya pastilah kami termasuk orang-orang yang merug.`,
        narrator: `QS. Al A’raf: 23`,
      },
    ],
  },
  {
    id: 2,
    title: `Meminta Agar Tergolong Orang-orang Beriman`,
    types: [`quran`],
    contents: [
      {
        id: 1,
        arabic: `<p>رَبِّ هَبْ لِي حُكْمًا وَأَلْحِقْنِي بِالصَّالِحِينَ وَاجْعَلْ لِي لِسَانَ صِدْقٍ فِي الْآخِرِينَ وَاجْعَلْنِي مِنْ وَرَثَةِ جَنَّةِ النَّعِيمِ</p>`,
        transliteration: null,
        translation: `Ya Tuhanku, berikanlah kepadaku hikmah dan masukkanlah aku ke dalam golongan orang-orang yang saleh. an jadikanlah aku buah tutur yang baik bagi orang-orang (yang datang) kemudian. dan jadikanlah aku termasuk orang-orang yang mempusakai surga yang penuh kenikmatan.`,
        narrator: `QS. Asy Syu’ara: 83-85`,
      },
      {
        id: 2,
        arabic: `<p>رَبَّنَا آمَنَّا فَاكْتُبْنَا مَعَ الشَّاهِدِينَ</p>`,
        transliteration: null,
        translation: `Ya Tuhan kami, kami telah beriman, maka catatlah kami bersama orang-orang yang menjadi saksi (atas kebenaran Al Quran dan kenabian Muhammad).`,
        narrator: `QS. Al Maidah: 83`,
      },
    ],
  },
  {
    id: 3,
    title: `Meminta Agar Diberikan Keturunan yang Shalih`,
    types: [`quran`],
    contents: [
      {
        id: 1,
        arabic: `<p>رَبِّ لَا تَذَرْنِي فَرْدًا وَأَنْتَ خَيْرُ الْوَارِثِينَ</p>`,
        transliteration: null,
        translation: `Ya Tuhanku janganlah Engkau membiarkan aku hidup seorang diri dan Engkaulah Waris Yang Paling Baik.`,
        narrator: `QS. Al Anbiya: 89`,
      },
      {
        id: 2,
        arabic: `<p>رَبِّ هَبْ لِي مِنَ الصَّالِحِينَ</p>`,
        transliteration: null,
        translation: `Ya Tuhanku, anugrahkanlah kepadaku (seorang anak) yang termasuk orang-orang yang saleh.`,
        narrator: `QS. Ash Shaffat: 100`,
      },
      {
        id: 3,
        arabic: `<p>رَبِّ هَبْ لِي مِنْ لَدُنْكَ ذُرِّيَّةً طَيِّبَةً إِنَّكَ سَمِيعُ الدُّعَاءِ</p>`,
        transliteration: null,
        translation: `Ya Tuhanku, berilah aku dari sisi Engkau seorang anak yang baik. Sesungguhnya Engkau Maha Pendengar doa.`,
        narrator: `QS. Al Imran: 38`,
      },
      {
        id: 4,
        arabic: `<p>رَبَّنَا هَبْ لَنَا مِنْ أَزْوَاجِنَا وَذُرِّيَّاتِنَا قُرَّةَ أَعْيُنٍ وَاجْعَلْنَا لِلْمُتَّقِينَ إِمَامًا</p>`,
        transliteration: null,
        translation: `Ya Tuhan kami, anugrahkanlah kepada kami isteri-isteri kami dan keturunan kami sebagai penyenang hati (kami), dan jadikanlah kami imam bagi orang-orang yang bertakwa.`,
        narrator: `QS. Al Furqan: 74`,
      },
    ],
  },
  {
    id: 4,
    title: `Meminta Ampunan bagi Kedua Orang Tua dan Kaum Mukminin`,
    types: [`quran`],
    contents: [
      {
        id: 1,
        arabic: `<p>رَبَّنَا اغْفِرْ لِي وَلِوَالِدَيَّ وَلِلْمُؤْمِنِينَ يَوْمَ يَقُومُ الْحِسَابُ</p>`,
        transliteration: null,
        translation: `Ya Tuhan kami, beri ampunlah aku dan kedua ibu bapaku dan sekalian orang-orang mukmin pada hari terjadinya hisab (hari kiamat).`,
        narrator: `QS. Ibrahim: 41`,
      },
      {
        id: 2,
        arabic: `<p>رَبَّنَا اغْفِرْ لَنَا وَلِإِخْوَانِنَا الَّذِينَ سَبَقُونَا بِالْإِيمَانِ وَلَا تَجْعَلْ فِي قُلُوبِنَا غِلًّا لِلَّذِينَ آمَنُوا رَبَّنَا إِنَّكَ رَءُوفٌ رَحِيمٌ</p>`,
        transliteration: null,
        translation: `Ya Rabb kami, beri ampunlah kami dan saudara-saudara kami yang telah beriman lebih dulu dari kami, dan janganlah Engkau membiarkan kedengkian dalam hati kami terhadap orang-orang yang beriman; Ya Rabb kami, Sesungguhnya Engkau Maha Penyantun lagi Maha Penyayang.`,
        narrator: `QS. Al Hasyr: 10`,
      },
      {
        id: 3,
        arabic: `<p>رَبِّ اغْفِرْ لِي وَلِوَالِدَيَّ وَلِمَنْ دَخَلَ بَيْتِيَ مُؤْمِنًا وَلِلْمُؤْمِنِينَ وَالْمُؤْمِنَاتِ وَلَا تَزِدِ الظَّالِمِينَ إِلَّا تَبَارًا</p>`,
        transliteration: null,
        translation: `Ya Tuhanku! Ampunilah aku, ibu bapakku, orang yang masuk ke rumahku dengan beriman dan semua orang yang beriman laki-laki dan perempuan. Dan janganlah Engkau tambahkan bagi orang-orang yang zalim itu selain kebinasaan.`,
        narrator: `QS. Nuh: 28`,
      },
    ],
  },
  {
    id: 5,
    title: `Meminta Ketetapan bagi Diri dan Keluarga dalam Mendirikan Solat`,
    types: [`quran`],
    contents: [
      {
        id: 1,
        arabic: `<p>رَبِّ اجْعَلْنِي مُقِيمَ الصَّلَاةِ وَمِنْ ذُرِّيَّتِي رَبَّنَا وَتَقَبَّلْ دُعَاءِ</p>`,
        transliteration: null,
        translation: `Ya Tuhanku, jadikanlah aku dan anak cucuku orang-orang yang tetap mendirikan shalat, ya Tuhan kami, perkenankanlah doaku.`,
        narrator: `QS. Ibrahim: 40`,
      },
    ],
  },
  {
    id: 6,
    title: `Meminta Perlindungan dari Orang yang Zhalim`,
    types: [`quran`],
    contents: [
      {
        id: 1,
        arabic: `<p>رَبِّ نَجِّنِي مِنَ الْقَوْمِ الظَّالِمِينَ</p>`,
        transliteration: null,
        translation: `Ya Tuhanku, selamatkanlah aku dari orang-orang yang zalim.`,
        narrator: `QS. Al Qashash: 21`,
      },
      {
        id: 2,
        arabic: `<p>رَبَّنَا لَا تَجْعَلْنَا مَعَ الْقَوْمِ الظَّالِمِينَ</p>`,
        transliteration: null,
        translation: `Ya Tuhan kami, janganlah Engkau tempatkan kami bersama-sama orang-orang yang zalim.`,
        narrator: `QS. Al A’raf: 47`,
      },
      {
        id: 3,
        arabic: `<p>رَبِّ انْصُرْنِي عَلَى الْقَوْمِ الْمُفْسِدِينَ</p>`,
        transliteration: null,
        translation: `Ya Tuhanku, tolonglah aku (dengan menimpakan azab) atas kaum yang berbuat kerusakan.`,
        narrator: `QS. Al Ankabut: 30`,
      },
    ],
  },
  {
    id: 7,
    title: `Meminta Agar Diterima Amal Ibadah dan Taubat`,
    types: [`quran`],
    contents: [
      {
        id: 1,
        arabic: `<p>رَبَّنَا تَقَبَّلْ مِنَّا إِنَّكَ أَنْتَ السَّمِيعُ الْعَلِيمُ وَتُبْ عَلَيْنَا إِنَّكَ أَنْتَ التَّوَّابُ الرَّحِيمُ</p>`,
        transliteration: null,
        translation: `Ya Tuhan kami terimalah daripada kami (amalan kami), dan terimalah taubat kami. Sesungguhnya Engkaulah Yang Maha Penerima taubat lagi Maha Penyayang.`,
        narrator: `QS. Al Baqarah: 127-128`,
      },
    ],
  },
  {
    id: 8,
    title: `Meminta Agar Dapat Bertawakkal Hanya Kepada Allah`,
    types: [`quran`],
    contents: [
      {
        id: 1,
        arabic: `<p>رَبَّنَا عَلَيْكَ تَوَكَّلْنَا وَإِلَيْكَ أَنَبْنَا وَإِلَيْكَ الْمَصِيرُ</p>`,
        transliteration: null,
        translation: `Ya Tuhan kami hanya kepada Engkaulah kami bertawakkal dan hanya kepada Engkaulah kami bertaubat dan hanya kepada Engkaulah kami kembali.`,
        narrator: `QS. Al Mumtahanah: 4`,
      },
      {
        id: 2,
        arabic: `<p>حَسْبِيَ اللَّهُ لَا إِلَهَ إِلَّا هُوَ عَلَيْهِ تَوَكَّلْتُ وَهُوَ رَبُّ الْعَرْشِ الْعَظِيمِ</p>`,
        transliteration: null,
        translation: `Cukuplah Allah bagiku; tidak ada Tuhan selain Dia. Hanya kepada-Nya aku bertawakkal dan Dia adalah Tuhan yang memiliki 'Arsy yang agung.`,
        narrator: `QS. At Taubah: 129`,
      },
    ],
  },
  {
    id: 9,
    title: `Meminta Perlindungan dari Keburukan Orang-orang Kafir`,
    types: [`quran`],
    contents: [
      {
        id: 1,
        arabic: `<p>رَبَّنَا لَا تَجْعَلْنَا فِتْنَةً لِلَّذِينَ كَفَرُوا وَاغْفِرْ لَنَا رَبَّنَا إِنَّكَ أَنْتَ الْعَزِيزُ الْحَكِيمُ</p>`,
        transliteration: null,
        translation: `Ya Tuhan kami, janganlah Engkau jadikan kami (sasaran) fitnah bagi orang-orang kafir. Dan ampunilah kami ya Tuhan kami. Sesungguhnya Engkaulah Yang Maha Perkasa lagi Maha Bijaksana.`,
        narrator: `QS. Al Mumtahanah: 5`,
      },
      {
        id: 2,
        arabic: `<p>رَبَّنَا لَا تَجْعَلْنَا فِتْنَةً لِلْقَوْمِ الظَّالِمِينَ وَنَجِّنَا بِرَحْمَتِكَ مِنَ الْقَوْمِ الْكَافِرِينَ</p>`,
        transliteration: null,
        translation: `Ya Tuhan kami; janganlah Engkau jadikan kami sasaran fitnah bagi kaum yang zalim dan selamatkanlah kami dengan rahmat Engkau dari (tipu daya) orang-orang yang kafir.`,
        narrator: `QS. Yunus: 85-86`,
      },
    ],
  },
  {
    id: 10,
    title: `Meminta Agar Ditambahkan Ilmu`,
    types: [`quran`],
    contents: [
      {
        id: 1,
        arabic: `<p>رَبِّ زِدْنِي عِلْمًا</p>`,
        transliteration: null,
        translation: `Ya Tuhanku, tambahkanlah aku ilmu.`,
        narrator: `QS. Thaha: 114`,
      },
    ],
  },
  {
    id: 11,
    title: `Meminta Agar Disempurnakan Cahaya`,
    types: [`quran`],
    contents: [
      {
        id: 1,
        arabic: `<p>رَبَّنَا أَتْمِمْ لَنَا نُورَنَا وَاغْفِرْ لَنَا إِنَّكَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ</p>`,
        transliteration: null,
        translation: `Ya Rabb kami, sempurnakanlah bagi kami cahaya kami dan ampunilah kami; Sesungguhnya Engkau Maha Kuasa atas segala sesuatu.`,
        narrator: `QS. At Tahrim: 8`,
      },
    ],
  },
  {
    id: 12,
    title: `Meminta Kebaikan dunia dan Akhirat`,
    types: [`quran`],
    contents: [
      {
        id: 1,
        arabic: `<p>رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ</p>`,
        transliteration: null,
        translation: `Ya Tuhan kami, berilah kami kebaikan di dunia dan kebaikan di akhirat dan peliharalah kami dari siksa neraka.`,
        narrator: `QS. Al Baqarah: 201`,
      },
    ],
  },
  {
    id: 13,
    title: `Meminta Agar Dijadikan Hamba yang Bersyukur`,
    types: [`quran`],
    contents: [
      {
        id: 1,
        arabic: `<p>رَبِّ أَوْزِعْنِي أَنْ أَشْكُرَ نِعْمَتَكَ الَّتِي أَنْعَمْتَ عَلَيَّ وَعَلَى وَالِدَيَّ وَأَنْ أَعْمَلَ صَالِحًا تَرْضَاهُ وَأَدْخِلْنِي بِرَحْمَتِكَ فِي عِبَادِكَ الصَّالِحِينَ</p>`,
        transliteration: null,
        translation: `Ya Tuhanku berilah aku ilham untuk tetap mensyukuri nikmat Mu yang telah Engkau anugerahkan kepadaku dan kepada dua orang ibu bapakku dan untuk mengerjakan amal saleh yang Engkau ridhai; dan masukkanlah aku dengan rahmat-Mu ke dalam golongan hamba-hamba-Mu yang saleh.`,
        narrator: `QS. An Naml: 19`,
      },
      {
        id: 2,
        arabic: `<p>رَبِّ أَوْزِعْنِي أَنْ أَشْكُرَ نِعْمَتَكَ الَّتِي أَنْعَمْتَ عَلَيَّ وَعَلَى وَالِدَيَّ وَأَنْ أَعْمَلَ صَالِحًا تَرْضَاهُ وَأَصْلِحْ لِي فِي ذُرِّيَّتِي إِنِّي تُبْتُ إِلَيْكَ وَإِنِّي مِنَ الْمُسْلِمِينَ</p>`,
        transliteration: null,
        translation: `Ya Tuhanku, tunjukilah aku untuk mensyukuri nikmat Engkau yang telah Engkau berikan kepadaku dan kepada ibu bapakku dan supaya aku dapat berbuat amal yang saleh yang Engkau ridhai; berilah kebaikan kepadaku dengan (memberi kebaikan) kepada anak cucuku. Sesungguhnya aku bertaubat kepada Engkau dan sesungguhnya aku termasuk orang-orang yang berserah diri.`,
        narrator: `QS. Al Ahqaf: 15`,
      },
    ],
  },
  {
    id: 14,
    title: `Meminta Perlindungan dari Syaitan`,
    types: [`quran`],
    contents: [
      {
        id: 1,
        arabic: `<p>رَبِّ أَعُوذُ بِكَ مِنْ هَمَزَاتِ الشَّيَاطِينِ  وَأَعُوذُ بِكَ رَبِّ أَنْ يَحْضُرُونِ</p>`,
        transliteration: null,
        translation: `Ya Tuhanku aku berlindung kepada Engkau dari bisikan-bisikan syaitan n aku berlindung (pula) kepada Engkau ya Tuhanku, dari kedatangan mereka kepadaku.`,
        narrator: `QS. Al Mu’minun: 97-98`,
      },
    ],
  },
  {
    id: 15,
    title: `Meminta Agar Hati Ditetapkan dalam Hidayah`,
    types: [`quran`],
    contents: [
      {
        id: 1,
        arabic: `<p>رَبَّنَا لَا تُزِغْ قُلُوبَنَا بَعْدَ إِذْ هَدَيْتَنَا وَهَبْ لَنَا مِنْ لَدُنْكَ رَحْمَةً إِنَّكَ أَنْتَ الْوَهَّابُ</p>`,
        transliteration: null,
        translation: `Ya Tuhan kami, janganlah Engkau jadikan hati kami condong kepada kesesatan sesudah Engkau beri petunjuk kepada kami, dan karuniakanlah kepada kami rahmat dari sisi Engkau; karena sesungguhnya Engkau-lah Maha Pemberi (karunia).`,
        narrator: `QS. Al Imran: 8`,
      },
    ],
  },
  {
    id: 16,
    title: `Meminta Agar Dilapangkan Hati dan Dimudahkan Dalam Urusan`,
    types: [`quran`],
    contents: [
      {
        id: 1,
        arabic: `<p>رَبِّ اشْرَحْ لِي صَدْرِي  وَيَسِّرْ لِي أَمْرِي وَاحْلُلْ عُقْدَةً مِنْ لِسَانِي  يَفْقَهُوا قَوْلِي</p>`,
        transliteration: null,
        translation: `Ya Tuhanku, lapangkanlah untukku dadaku,  dan mudahkanlah untukku urusanku, dan lepaskanlah kekakuan dari lidahku, supaya mereka mengerti perkataanku.`,
        narrator: `QS. Thaha: 25-28`,
      },
      {
        id: 2,
        arabic: `<p>رَبَّنَا آتِنَا مِنْ لَدُنْكَ رَحْمَةً وَهَيِّئْ لَنَا مِنْ أَمْرِنَا رَشَدًا</p>`,
        transliteration: null,
        translation: `Wahai Tuhan kami, berikanlah rahmat kepada kami dari sisi-Mu dan sempurnakanlah bagi kami petunjuk yang lurus dalam urusan kami (ini).`,
        narrator: `QS. Al Kahfi: 10`,
      },
    ],
  },
  {
    id: 17,
    title: `Meminta Keamanan Negeri dan Berlindung dari Syirik`,
    types: [`quran`],
    contents: [
      {
        id: 1,
        arabic: `<p>رَبِّ اجْعَلْ هَذَا الْبَلَدَ آمِنًا وَاجْنُبْنِي وَبَنِيَّ أَنْ نَعْبُدَ الْأَصْنَامَ</p>`,
        transliteration: null,
        translation: `Ya Tuhanku, jadikanlah negeri ini (Mekah), negeri yang aman, dan jauhkanlah aku beserta anak cucuku daripada menyembah berhala-berhala.`,
        narrator: `QS. Ibrahim: 35`,
      },
    ],
  },
  {
    id: 18,
    title: `Meminta Perlindungan dari Api Neraka`,
    types: [`quran`],
    contents: [
      {
        id: 1,
        arabic: `<p>رَبَّنَا اصْرِفْ عَنَّا عَذَابَ جَهَنَّمَ إِنَّ عَذَابَهَا كَانَ غَرَامًا  إِنَّهَا سَاءَتْ مُسْتَقَرًّا وَمُقَامًا</p>`,
        transliteration: null,
        translation: `Ya Tuhan kami, jauhkan azab jahannam dari kami, sesungguhnya azabnya itu adalah kebinasaan yang kekal. Sesungguhnya jahannam itu seburuk-buruk tempat menetap dan tempat kediaman.`,
        narrator: `QS. Al Furqan: 65-66`,
      },
    ],
  },
  {
    id: 19,
    title: `Ditetapkan Hati dalam Iman`,
    types: [`nabi`],
    contents: [
      {
        id: 1,
        arabic: `<p>اَللَّهُمَّ يا مُصَرِّفَ الْقُلُوْبِ، صَرِّفْ قُلُوْبَنَا عَلَى دِينِكَ</p>`,
        transliteration: null,
        translation: `"Wahai Tuhan yang membolak-balikkan hati, teguhkanlah hatiku pada agamaMu."`,
        narrator: `HR. Muslim No. 2654`,
      },
    ],
  },
  {
    id: 20,
    title: `Ampunan dalam Segala Hal`,
    types: [`nabi`],
    contents: [
      {
        id: 1,
        arabic: `<p>اَللّهُمَّ اغْفِرْ لِيْ خَطِيْئَتِيْ، وَجَهْلِيْ، وَإِسْرَافِيْ فِي أَمْرِيْ، وَمَا أَنْتَ أَعْلَمُ بِهِ مِنِّيْ. اللّهُمَّ اغْفِرْ لِيْ جَدِّيْ وَهَزْلِيْ، وَخَطَئِيْ وَعَمْدِيْ، وَكُلُّ ذلِكَ عِنْدِيْ، اللّهُمَّ اغْفِرْ لِيْ مَا قَدَّمْتُ، وَمَا أَخَّرْتُ، وَمَا أَسْرَرْتُ، وَمَا أَعْلَنْتُ، وَمَا أَنْتَ أَعْلَمُ بِهِ مِنِّيْ، أَنْتَ الْمُقَدِّمُ، وَأَنْتَ الْمُؤَخِّرُ، وَأَنْتَ عَلَى كُلِّ شَيْءٍ قَدِيْرٌ.</p>`,
        transliteration: null,
        translation: `"Ya Allah, ampunilah kesalahanku, kebodohanku, keberlebih-lebihan dalam perkaraku, dan apa yang Engkau lebih mengetahui daripadaku. Ya Allah, ampunilah diriku dalam kesungguhanku, kelalaianku, kesalahanku, kesengajaanku, dan semua itu adalah berasal dari sisiku. Ya Allah, ampunilah aku dari segala dosa yang telah aku lakukan dan yang belum aku lakukan, segala dosa yang aku sembunyikan dan yang aku tampakkan, dan dosa yang Engkau lebih mengetahui daripadaku, Engkaulah Yang Maha Mendahulukan dan Yang mengakhirkan, dan Engkau Mahakuasa atas segala sesuatu."`,
        narrator: `HR. Bukhari No. 6398 dan Muslim No. 2719`,
      },
    ],
  },
  {
    id: 21,
    title: `Mohon Diperbaiki Segala Urusan`,
    types: [`nabi`],
    contents: [
      {
        id: 1,
        arabic: `<p>اَللَّـهُـَّم أَصْلِحْ لِي دِينِي الّذِي هُوَ عِصْمَةُ أَمْرِي، وَأَصْلِحْ لِي دُنْيَايَ الّتِي فِيهَا مَعَاشِي، وَأَصْلِحْ لِي آخِرَتِي الّتِي فِيهَا مَعَادِي، وَاجْعَلِ الْحَيَاةَ زِيَادَةً لِي فِي كُلِّ خَيْرٍ، وَاجْعَلِ الْمَوْتَ رَاحَةً لِي مِنْ كُلِّ شَرٍّ</p>`,
        transliteration: null,
        translation: `"Ya Allah mohon kebaikan pada urusan agamaku karena itu adalah penjaga semua urusanku. Aku mohon kebaikan pada urusan duniaku karena itu tempat hidupku. Aku mohon kebaikan pada urusan akhiratku karena itu tempat kembaliku. Jadikanlah hidup ini tambahan kebaikan bagiku, dan jadikanlah kematianku waktu istirahat bagiku dari segala keburukan."`,
        narrator: `HR. Muslim No. 2720`,
      },
    ],
  },
  {
    id: 22,
    title: `Perlindungan dari Fitnah Kaya dan Fitnah Miskin`,
    types: [`nabi`],
    contents: [
      {
        id: 1,
        arabic: `<p>اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الكَسَلِ وَالهَرَمِ، وَالمَأْثَمِ وَالمَغْرَمِ، وَمِنْ فِتْنَةِ القَبْرِ، وَعَذَابِ القَبْرِ، وَمِنْ فِتْنَةِ النَّارِ وَعَذَابِ النَّارِ، وَمِنْ شَرِّ فِتْنَةِ الغِنَى، وَأَعُوذُ بِكَ مِنْ فِتْنَةِ الفَقْرِ، وَأَعُوذُ بِكَ مِنْ فِتْنَةِ الَمسِيحِ الدَّجَّال</p>`,
        transliteration: null,
        translation: `"Ya Allah, aku berlindung kepada-Mu dari kemalasan dan usia jompo, perbuatan dosa dan hutang, fitnah kubur dan azab kubur, fitnah neraka dan azab neraka, keburukan fitnah kekayaan; aku berlindung kepada-Mu dari fitnah kemiskinan dan aku berlindung kepada-Mu dari fitnah Masih Dajjal."`,
        narrator: `HR. Bukhari No. 6368`,
      },
    ],
  },
  {
    id: 23,
    title: `Perlindungan Dicabutnya Nikmat Lahir Batin`,
    types: [`nabi`],
    contents: [
      {
        id: 1,
        arabic: `<p>اللَّهُمَّ إِنِّى أَعُوذُ بِكَ مِنْ زَوَالِ نِعْمَتِكَ وَتَحَوُّلِ عَافِيَتِكَ وَفُجَاءَةِ نِقْمَتِكَ وَجَمِيعِ سَخَطِكَ</p>`,
        transliteration: null,
        translation: `"Ya Allah, sesungguhnya aku berlindung kepada-Mu dari hilangnya kenikmatan yang telah Engkau berikan, dari berubahnya kesehatan yang telah Engkau anugerahkan, dari siksa-Mu yang datang secara tiba-tiba, dan dari segala kemurkaan-Mu."`,
        narrator: `HR. Muslim No. 2739`,
      },
    ],
  },
  {
    id: 24,
    title: `Agar Dijauhkan dari Sifat Pengecut dan Tidak Pikun`,
    types: [`nabi`],
    contents: [
      {
        id: 1,
        arabic: `<p>اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْجُبْنِ، وَأَعُوذُ بِكَ أَنْ أُرَدَّ إِلَى أَرْذَلِ الْعُمُرِ، وَأَعُوذُ بِكَ مِنْ فِتْنَةِ الدُّنْيَا، وَأَعُوذُ بِكَ مِنْ عَذَابِ الْقَبْرِ</p>`,
        transliteration: null,
        translation: `"Ya Allah, aku berlindung kepada-Mu dari sikap pengecut, aku berlindung kepada-Mu kepada serendah-rendahnya usia (pikun), aku berpindung kepada-Mu dari fitnah dunia, dan aku berlindung berlindung kepada-Mu dari adzab kubur."`,
        narrator: `HR. Bukhari No. 2822`,
      },
    ],
  },
  {
    id: 25,
    title: `Berlindung dari Keburukan Amal`,
    types: [`nabi`],
    contents: [
      {
        id: 1,
        arabic: `<p>اللهُمَّ إِنِّي أَعُوذُ بِكَ مِنْ شَرِّ مَا عَمِلْتُ، وَشَرِّ مَا لَمْ أَعْمَلْ</p>`,
        transliteration: null,
        translation: `"Ya Allah, aku berlindung dari keburukan yang telah aku perbuat dan keburukan yang belum aku perbuat."`,
        narrator: `HR. Muslim No. 2716`,
      },
    ],
  },
  {
    id: 26,
    title: `Agar Bertaqwa dan Berlindung dari Ilmu yang Tidak Bermanfaat`,
    types: [`nabi`],
    contents: [
      {
        id: 1,
        arabic: `<p>اللهُمَّ آتِ نَفْسِي تَقْوَاهَا، وَزَكِّهَا أَنْتَ خَيْرُ مَنْ زَكَّاهَا، أَنْتَ وَلِيُّهَا وَمَوْلَاهَا، اللهُمَّ إِنِّي أَعُوذُ بِكَ مِنْ عِلْمٍ لَا يَنْفَعُ، وَمِنْ قَلْبٍ لَا يَخْشَعُ، وَمِنْ نَفْسٍ لَا تَشْبَعُ، وَمِنْ دَعْوَةٍ لَا يُسْتَجَابُ لَهَا</p>`,
        transliteration: null,
        translation: `"Ya Allah karuniakan ketakwaan pada jiwaku. Sucikanlah ia, sesungguhnya Engkaulah sebaik-baik yang mensucikannya, Engkau-lah Yang Menjaga serta Melindunginya. Ya Allah, aku berlindung kepada-Mu dari Ilmu yang tidak manfaat, hati yang tidak khusyu, dan doa yang tidak diijabahi."`,
        narrator: `HR. Muslim No. 2722`,
      },
    ],
  },
  {
    id: 27,
    title: `Mohon Bisa Melihat Wajah Allah`,
    types: [`nabi`],
    contents: [
      {
        id: 1,
        arabic: `<p>اللَّهُمَّ إِنِّي أَسْأَلُكَ لَذَّةَ النَّظَرِ إِلَى وَجْهِكَ، وَالشَّوْقَ إِلَى لِقَائِكَ فِي غَيْرِ ضَرَّاءَ مُضِرَّةٍ، وَلَا فِتْنَةٍ مُضِلَّةٍ</p>`,
        transliteration: null,
        translation: `"Ya Allah, Aku mohon kepada-Mu kenikmatan memandang wajah-Mu (di Surga), rindu bertemu dengan-Mu tanpa penderitaan yang membahayakan dan fitnah yang menyesatkan."`,
        narrator: `HR. Nasai No. 1305 dan dishahihkan al-Albani`,
      },
    ],
  },
  {
    id: 28,
    title: `Dimudahkan Berbuat Baik & Mencintai Orang Miskin`,
    types: [`nabi`],
    contents: [
      {
        id: 1,
        arabic: `<p>اللَّهُمَّ إِنِّى أَسْأَلُكَ فِعْلَ الْخَيْرَاتِ وَتَرْكَ الْمُنْكَرَاتِ وَحُبَّ الْمَسَاكِينِ وَأَنْ تَغْفِرَ لِى وَتَرْحَمَنِى وَإِذَا أَرَدْتَ فِتْنَةَ قَوْمٍ فَتَوَفَّنِى غَيْرَ مَفْتُونٍ</p>`,
        transliteration: null,
        translation: `"Ya Allah, aku memohon kepada-Mu untuk mudah melakukan kebaikan dan meninggalkan kemungkaran serta aku memohon pada-Mu supaya bisa mencintai orang miskin,ampunilah (dosa-dosa)ku, rahmatilah saya, jika Engkau menginginkan untuk menguji suatu kaum maka wafatkanlah saya dalam keadaan tidak tenggelam dalam ujian."`,
        narrator: `HR. Tirmidzi No. 3235 dan Ahmad 5: 243, dan Dishahihkan al-Albani`,
      },
    ],
  },
  {
    id: 29,
    title: `Mohon Agar Bisa Mencintai Orang yang Mencintai Allah`,
    types: [`nabi`],
    contents: [
      {
        id: 1,
        arabic: `<p>اللَّهُمَّ إِنِّى أَسْأَلُكَ حُبَّكَ وَحُبَّ مَنْ يُحِبُّكَ وَحُبَّ عَمَلٍ يُقَرِّبُ إِلَى حُبِّكَ</p>`,
        transliteration: null,
        translation: `"Saya memohon agar dapat mencintai-Mu, mencintai orang-orang yang mencintai-Mu dan mencintai amal yang dapat mendekatkan diriku kepada cinta-Mu."`,
        narrator: `HR. Tirmidzi no. 3235 dan Ahmad 5: 243, dan Dishahihkan al-Albani`,
      },
    ],
  },
  {
    id: 30,
    title: `Mohon Kebaikan dalam Segala Hal yang Pernah Diminta Nabi`,
    types: [`nabi`],
    contents: [
      {
        id: 1,
        arabic: `<p>اللَّهُمَّ إِنِّي أَسْأَلُكَ مِنَ الْخَيْرِ كُلِّهِ عَاجِلِهِ وَآجِلِهِ، مَا عَلِمْتُ مِنْهُ وَمَا لَمْ أَعْلَمْ، وَأَعُوذُ بِكَ مِنَ الشَّرِّ كُلِّهِ عَاجِلِهِ وَآجِلِهِ، مَا عَلِمْتُ مِنْهُ وَمَا لَمْ أَعْلَمْ، اللَّهُمَّ إِنِّي أَسْأَلُكَ مِنْ خَيْرِ مَا سَأَلَكَ عَبْدُكَ وَنَبِيُّكَ، وَأَعُوذُ بِكَ مِنْ شَرِّ مَا عَاذَ بِهِ عَبْدُكَ وَنَبِيُّكَ، اللَّهُمَّ إِنِّي أَسْأَلُكَ الْجَنَّةَ وَمَا قَرَّبَ إِلَيْهَا مِنْ قَوْلٍ أَوْ عَمَلٍ، وَأَعُوذُ بِكَ مِنَ النَّارِ وَمَا قَرَّبَ إِلَيْهَا مِنْ قَوْلٍ أَوْ عَمَلٍ، وَأَسْأَلُكَ أَنْ تَجْعَلَ كُلَّ قَضَاءٍ قَضَيْتَهُ لِي خَيْرًا</p>`,
        transliteration: null,
        translation: `"Ya Allah, sesungguhnya aku memohon kepadaMu seluruh kebaikan yang segera (dunia) dan yang tertunda (akhirat), kebaikan yang aku ketahui dan yang tidak aku ketahui.
      Dan aku berlindung kepadaMu dari segala keburukan yang segera (dunia) dan yang tertunda (akhirat), yang aku ketahui dan yang tidak aku ketahui.
      Aku meminta kepada-Mu kebaikan semua doa yang pernah diminta oleh hamba dan nabi-Mu, dan aku berlindung kepada-Mu dari keburukan, yang hamba dan nabi-Mu pernah berlindung darinya.
      Aku memohon surga kepadaMu dan segala perkataan dan perbuatan yang mendekatkan kepadanya. Aku berlindung kepadaMu dari neraka dan segala perkataan dan perbuatan yang mendekatkan kepadanya.
      Aku meminta segala sesuatu yang telah Engkau takdirkan untukku, hendaklah Engkau jadikan kebaikan bagiku.
    "`,
        narrator: `HR. Ahmad No. 25019, Ibnu Majah No. 3846 dan dishahihkan Syuaib al-Arnauth`,
      },
    ],
  },
];

export default doas;
