const fs = require('fs');
const readline = require('readline');

// Terminal arayüzünü oluştur
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

console.log("\n📚 --- BELALI KÜTÜPHANE SİSTEMİ --- 📚");
console.log("Yeni kitap eklemek için bilgileri giriniz:\n");

const newBook = {};

// Soruları sırayla sor
rl.question('Kitap Adı (Title): ', (title) => {
    newBook.title = title;

    rl.question('Yazar (Author): ', (author) => {
        newBook.author = author;

        rl.question('Yıl (Year): ', (year) => {
            newBook.year = parseInt(year); // Sayıya çevir

            rl.question('Açıklama (Desc): ', (desc) => {
                newBook.desc = desc;

                // Tüm sorular bitti, kaydetme işlemine geç
                saveBook(newBook);
                rl.close();
            });
        });
    });
});

function saveBook(book) {
    const fileName = 'books.json';

    // 1. Mevcut dosyayı oku
    fs.readFile(fileName, 'utf8', (err, data) => {
        let library = [];

        if (!err && data) {
            // Dosya varsa ve doluysa, mevcut listeyi al
            try {
                library = JSON.parse(data);
            } catch (e) {
                console.log("⚠️  JSON dosyası bozuktu, yeni liste başlatılıyor.");
            }
        } else {
            console.log("⚠️  books.json bulunamadı, yeni oluşturuluyor.");
        }

        // 2. Yeni kitabı listeye ekle
        library.push(book);

        // 3. Dosyayı tekrar kaydet (Pretty Print ile düzgün formatta)
        fs.writeFile(fileName, JSON.stringify(library, null, 2), (err) => {
            if (err) {
                console.error('❌ HATA: Kaydedilemedi!', err);
            } else {
                console.log('\n✅ BAŞARILI!');
                console.log('-----------------------------------');
                console.log(`Eklenen: ${book.title} (${book.year})`);
                console.log('-----------------------------------');
                console.log("💡 İpucu: Sitede görünmesi için GitHub'a pushlamayı unutma.");
            }
        });
    });
}