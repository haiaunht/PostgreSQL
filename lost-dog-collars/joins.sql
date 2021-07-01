-- Display only collars with known owners and those owners' names.
SELECT lost_dog_collars.dog_name AS Dog_has_Owner, dog_owners.name AS Owner
  FROM lost_dog_collars 
  JOIN dog_owners 
  ON (lost_dog_collars.dog_name = dog_owners.dog_name);

-- Display only collars without known owners
SELECT lost_dog_collars.dog_name AS Dog_has_no_owner
  FROM lost_dog_collars 
  FULL OUTER JOIN dog_owners 
  ON (lost_dog_collars.dog_name = dog_owners.dog_name)
WHERE dog_owners.name IS NULL;

-- Display all collars in our possession. If an owner exists for a given collar, display that also.
SELECT lost_dog_collars.dog_name AS collars_in_possession, dog_owners.name AS Owner
  FROM lost_dog_collars 
  LEFT OUTER JOIN dog_owners 
  ON (lost_dog_collars.dog_name = dog_owners.dog_name);  

-- What owners do we know about? Display all owners known to us. If a collar matches that owner, display the collar also.
SELECT dog_owners.name AS Owner, lost_dog_collars.dog_name AS Collar
  FROM dog_owners 
  LEFT OUTER JOIN lost_dog_collars 
  ON (lost_dog_collars.dog_name = dog_owners.dog_name);