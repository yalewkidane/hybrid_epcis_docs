# Developer Documentation

## How to Create a New Page in Sphinx Documentation

To create a new page in your Sphinx documentation, follow these steps:

1. **Create a New RST File**:
   Create a new reStructuredText (`.rst`) file in the `docs` directory. For example, to create a page for `epcis_hash`, create a file named `epcis_hash.rst`.

   ```sh
   touch docs/epcis_hash.rst


2. Edit the New RST File: Open the newly created epcis_hash.rst file and add the content you want to include. Here is an example:
.. _epcis_hash:

EPCIS Hash
==========

This page describes the `epcis_hash` functionality.

.. contents:: Table of Contents
   :depth: 2
   :local:

Overview
--------

`epcis_hash` is a function that ...

Usage
-----

Here is how you use `epcis_hash`:

.. code-block:: python

   from epcis_module import epcis_hash

   result = epcis_hash(data)
   print(result)

Parameters
----------

- **data**: The input data for the hash function.

Returns
-------

- **result**: The hashed result.

Examples
--------

Here are some examples of using `epcis_hash`:

.. code-block:: python

   example_data = "example"
   print(epcis_hash(example_data))


3. Update the Table of Contents: To include the new page in the documentation's navigation, update the index.rst file (or the appropriate table of contents file) to reference the new page.

.. toctree::
   :maxdepth: 2
   :caption: Contents:

   epcis_hash

4. Rebuild the Documentation: After adding the new page and updating the table of contents, rebuild your Sphinx documentation to include the changes.

make html
