export default{
    data(){
        return{
            //This is the secretKey which is used in encryption and decryption
            secretkey: 'secret is secret'
        }
    },
    methods:{
        //This function is used to encrypt the string data against the secretKey
        encrypt: function(data){
            var key = this.$CryptoJS.enc.Utf8.parse(this.secretkey);
            var iv = this.$CryptoJS.enc.Utf8.parse(this.secretkey.substring(0, 16));
            var cipherText = this.$CryptoJS.AES.encrypt(data, key, {
                iv: iv,
                mode: this.$CryptoJS.mode.CBC,
                padding: this.$CryptoJS.pad.Pkcs7
            }).toString();
            return (cipherText);
          },
          //This function is used to decrypt the string data against the secretKey
          decrypt:function(data){
            var key = this.$CryptoJS.enc.Utf8.parse(this.secretkey);
            var iv = this.$CryptoJS.enc.Utf8.parse(this.secretkey.substring(0, 16));
      
            /*-- Decryption --*/
            var decrypted = this.$CryptoJS.AES.decrypt(data, key, {
                iv: iv,
                mode: this.$CryptoJS.mode.CBC,
                padding: this.$CryptoJS.pad.Pkcs7
            });
            return(decrypted.toString(this.$CryptoJS.enc.Utf8));
          },
    }
}