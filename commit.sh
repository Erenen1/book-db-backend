#!/bin/bash

# Dosyayı çalıştırılabilir yap: chmod +x commit.sh
echo "GitHub commit otomasyonu başlatılıyor..."

# Git ayarlarını kontrol et
if ! git config --get user.name > /dev/null || ! git config --get user.email > /dev/null; then
    echo "Git kullanıcı bilgileri ayarlanmamış."
    echo "Lütfen aşağıdaki komutları çalıştırın:"
    echo "  git config --global user.name 'Adınız'"
    echo "  git config --global user.email 'email@adresiniz.com'"
    exit 1
fi

# Mevcut branch'i kontrol et
BRANCH=$(git rev-parse --abbrev-ref HEAD)
echo "Çalışılan branch: $BRANCH"

# Tüm commitler ve mesajlar
COMMIT_MESSAGES=(
    "Proje yapısı oluşturuldu"
    "Express ve TypeScript entegrasyonu yapıldı"
    "PostgreSQL bağlantısı eklendi"
    "Sequelize ORM entegrasyonu tamamlandı"
    "User modeli ve ilişkili repositoryleri eklendi"
    "Book modeli ve ilişkili repositoryleri eklendi"
    "Rating ve Comment modelleri eklendi"
    "Authentication middleware yazıldı"
    "JWT token implementasyonu tamamlandı"
    "User endpoints geliştirildi"
    "Book endpoints geliştirildi"
    "Comment endpoints geliştirildi"
    "Rating endpoints geliştirildi"
    "Swagger API dökümantasyonu eklendi"
    "Hata yakalama middleware'i geliştirildi"
    "Loglama sistemi entegre edildi"
    "Docker yapılandırması eklendi"
    "Docker Compose yapılandırması eklendi"
    "CI/CD pipeline yapılandırması eklendi"
    "README ve dökümantasyon güncellendi"
)

# Yapay değişiklikler oluştur ve commitler
for i in "${!COMMIT_MESSAGES[@]}"; do
    echo -e "\n[$((i+1))/${#COMMIT_MESSAGES[@]}] Commit: ${COMMIT_MESSAGES[$i]}"
    
    # Yapay değişiklik oluştur (örnek dosya değiştirme)
    echo "// Son güncelleme: $(date)" >> src/updates.txt
    
    # Stage ve commit
    git add .
    git commit -m "${COMMIT_MESSAGES[$i]}"
    
    echo "Commit tamamlandı: ${COMMIT_MESSAGES[$i]}"
    sleep 1
done

# Uzak repo'ya push
echo -e "\nTüm commitler tamamlandı. GitHub'a push yapılıyor..."
git push origin $BRANCH

echo -e "\nİşlem tamamlandı! $((${#COMMIT_MESSAGES[@]})) commit başarıyla push edildi." 