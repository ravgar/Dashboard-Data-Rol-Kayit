const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Discord = require('discord.js');

const app = express();
const client = new Discord.Client();

mongoose.connect('MONGODB-URL-GİR', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Veritabanına başarıyla bağlanıldı.');
  })
  .catch((err) => {
    console.error('Veritabanı bağlantısı başarısız:', err);
  });

const GuildSettings = mongoose.model('GuildSettings', new mongoose.Schema({
  guildId: String,
  kayitciRol: String,
  kayitsizRoller: [String],
}));//MODELSSSS RAVGARSSS

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send(`
    <h1>Kayıt Ayarları</h1>
    <form action="/save-settings" method="post">
      <label for="guildId">Sunucu ID:</label>
      <input type="text" id="guildId" name="guildId" required>
      <br>
      <label for="kayitciRol">Kayıtçı Rolü:</label>
      <input type="text" id="kayitciRol" name="kayitciRol" required>
      <br>
      <label for="kayitsizRoller">Kayıtsız Roller:</label>
      <input type="text" id="kayitsizRoller" name="kayitsizRoller" required>
      <br>
      <button type="submit">Ayarları Kaydet</button>
    </form>
  `);
});

-app.post('/save-settings', (req, res) => {
  const { guildId, kayitciRol, kayitsizRoller } = req.body;
  
-  GuildSettings.findOneAndUpdate(
    { guildId },
    { kayitciRol, kayitsizRoller: kayitsizRoller.split(',') },
    { upsert: true, new: true },
    (err, guildSettings) => {
      if (err) {
        console.error('Ayarları kaydetme hatası:', err);
        res.send('Ayarları kaydetme sırasında bir hata oluştu.');
      } else {
        console.log('Ayarlar başarıyla kaydedildi:', guildSettings);
        res.send('Ayarlar başarıyla kaydedildi.');
      }
    }
  );
});

-client.on('guildMemberAdd', async (member) => {
  const guildSettings = await GuildSettings.findOne({ guildId: member.guild.id });

  if (guildSettings) {
    const kayitsizRoller = guildSettings.kayitsizRoller;
    const kayitsizRol = guildSettings.kayitciRol;

    const kayitsizRole = member.guild.roles.cache.find((role) => kayitsizRoller.includes(role.name));
    const kayitciRole = member.guild.roles.cache.find((role) => role.name === kayitsizRol);

    if (kayitsizRole) {
      member.roles.add(kayitsizRole);
    }

    if (kayitciRole) {
      member.roles.remove(kayitciRole);
    }
  }
});

-client.login('TOKEN GİR BE ABLA GÖZÜNÜ SEVİYİM BE ABİ');

const port = 3000; // TEMSİLİ GİRİLMİŞTİR SAYI DEĞİŞTİRİLEBİLİR
app.listen(port, () => {
  console.log(`RAVGARS LOCAL AKTİF ${port}`);
});
