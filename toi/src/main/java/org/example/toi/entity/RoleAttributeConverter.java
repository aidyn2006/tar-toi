package org.example.toi.entity;

import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;
import java.util.Locale;

@Converter(autoApply = false)
public class RoleAttributeConverter implements AttributeConverter<Role, String> {

    @Override
    public String convertToDatabaseColumn(Role attribute) {
        return attribute == null ? null : attribute.name();
    }

    @Override
    public Role convertToEntityAttribute(String dbData) {
        if (dbData == null || dbData.isBlank()) {
            return Role.USER;
        }
        String normalized = dbData.startsWith("ROLE_")
                ? dbData.substring("ROLE_".length())
                : dbData;
        return Role.valueOf(normalized.toUpperCase(Locale.ROOT));
    }
}

